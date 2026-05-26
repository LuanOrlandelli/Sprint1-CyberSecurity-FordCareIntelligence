package fordcare_api.controller;

import fordcare_api.dto.request.LoginRequest;
import fordcare_api.dto.response.LoginResponse;
import fordcare_api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        return authService.login(request, httpRequest);
    }
}