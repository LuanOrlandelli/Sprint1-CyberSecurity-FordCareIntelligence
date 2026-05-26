package fordcare_api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private Long userId;
    private String name;
    private String email;
    private Long roleId;
    private String roleName;
    private Long dealershipId;
    private String token;
    private String message;
}