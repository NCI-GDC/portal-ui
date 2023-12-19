echo "Build and push PORTAL docker image."
docker build -t ${REGISTRY}/portal-ui:${GIT_TAG} -f portal.Dockerfile . --build-arg http_proxy=http://cloud-proxy:3128 --build-arg https_proxy=http://cloud-proxy:3128 --build-arg GDC_BASE_PATH=/v1
docker push ${REGISTRY}/portal-ui:${GIT_TAG}

# Clean up docker image after pushing
docker rmi ${REGISTRY}/portal-ui:${GIT_TAG}

echo "Build and push AWGPORTAL docker image."
docker build -t ${REGISTRY}/awgportal:${GIT_TAG} -f awgportal.Dockerfile . --build-arg http_proxy=http://cloud-proxy:3128 --build-arg https_proxy=http://cloud-proxy:3128 --build-arg GDC_BASE_PATH=/
docker push ${REGISTRY}/awgportal:${GIT_TAG}

# Clean up docker image after pushing
docker rmi ${REGISTRY}/awgportal:${GIT_TAG}


# Do a soft prune
docker system prune -f --volumes
