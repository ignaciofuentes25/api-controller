mkdir -p ~/.kube/
echo "
apiVersion: v1
kind: Config
clusters:
- name: default-cluster
  cluster:
    certificate-authority-data: ${KUBERNETES_CA}
    server: ${KUBERNETES_ENDPOINT}
contexts:
- name: default-context
  context:
    cluster: default-cluster
    namespace: ${KUBERNETES_NAMESPACE}
    user: default-user
current-context: default-context
users:
- name: default-user
  user:
    token: ${KUBERNETES_TOKEN}
" > ~/.kube/config