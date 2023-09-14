package io.github.aylesw.finanshin.exception;

public class UnauthorizedResourceAccessException extends ApiException {
    public UnauthorizedResourceAccessException() {
        super("Resource does not belong to user");
    }
}
