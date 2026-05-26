package fordcare_api.service;

import fordcare_api.dto.request.LoginRequest;
import fordcare_api.dto.response.LoginResponse;
import fordcare_api.entity.Role;
import fordcare_api.entity.User;
import fordcare_api.repository.RoleRepository;
import fordcare_api.repository.UserRepository;
import fordcare_api.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditService auditService;

    private static final Logger logger =
            LoggerFactory.getLogger(AuthService.class);

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            BCryptPasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuditService auditService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditService = auditService;
    }

    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário ou senha inválidos"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Tentativa de login inválida para o e-mail: {}", request.getEmail());
            throw new RuntimeException("Usuário ou senha inválidos");
        }

        Role role = roleRepository.findById(user.getRoleId())
                .orElseThrow(() -> new RuntimeException("Perfil de acesso não encontrado"));

        String token = jwtService.generateToken(user, role.getName());

        logger.info("Login realizado com sucesso para o usuário: {}", user.getEmail());

        auditService.register(
                "LOGIN_SUCCESS",
                user.getEmail(),
                "/auth/login",
                httpRequest.getRemoteAddr()
        );

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRoleId(),
                role.getName(),
                user.getDealershipId(),
                token,
                "Login realizado com sucesso"
        );
    }
}