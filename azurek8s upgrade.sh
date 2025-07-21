AKS Upgrade Checklist
🔧 Preparation
1. Update Azure CLI: az upgrade

2. Check available versions:
az aks get-versions --location <your-region> --output table

3. Backup manifests:
kubectl get all --all-namespaces -o yaml > cluster-backup.yaml

4. Backup persistent data (DBs, storage, etc.)

5. Notify users or schedule maintenance window

6. Clone environment (optional) for testing

===========
Optional Extras
1. Drain node manually (if needed):
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

2. Set up PodDisruptionBudgets (PDBs) before the upgrade to prevent critical service downtime:
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: my-pdb
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: my-app

=======================
Automation script
#!/bin/bash

# Cluster config
RESOURCE_GROUP="myResourceGroup"
CLUSTER_NAME="myAKSCluster"
NODEPOOL_NAME="nodepool1"
VERSIONS=("1.30.1" "1.31.3" "1.32.2" "1.33.1")

echo "Starting AKS upgrade from 1.29.7 to 1.33.1..."

for VERSION in "${VERSIONS[@]}"
do
  echo "------------------------------------------"
  echo "Upgrading to Kubernetes version $VERSION..."
  echo "Step 1: Upgrade Control Plane"

  az aks upgrade \
    --resource-group $RESOURCE_GROUP \
    --name $CLUSTER_NAME \
    --kubernetes-version $VERSION \
    --control-plane-only \
    --yes

  echo "Step 2: Upgrade Node Pool: $NODEPOOL_NAME"

  az aks nodepool upgrade \
    --resource-group $RESOURCE_GROUP \
    --cluster-name $CLUSTER_NAME \
    --name $NODEPOOL_NAME \
    --kubernetes-version $VERSION \
    --yes

  echo "Version $VERSION upgrade complete."
  echo "Validating cluster health..."
  kubectl get nodes
  sleep 5
done

echo "------------------------------------------"
echo "AKS Upgrade Complete: Cluster is now running Kubernetes v1.33.1"
