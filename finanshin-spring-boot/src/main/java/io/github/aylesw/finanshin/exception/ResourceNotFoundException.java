package io.github.aylesw.finanshin.exception;

public class ResourceNotFoundException extends ApiException {

    public ResourceNotFoundException() {
        super("Resource not found");
    }

    public <T> ResourceNotFoundException(Class<T> resourceClazz, Object resourceId) {
        super(resourceClazz.getSimpleName() + " not found with id: " + resourceId);
    }

    public ResourceNotFoundException(String resourceName, Object resourceId) {
        super(resourceName + " not found with id: " + resourceId);
    }
}
