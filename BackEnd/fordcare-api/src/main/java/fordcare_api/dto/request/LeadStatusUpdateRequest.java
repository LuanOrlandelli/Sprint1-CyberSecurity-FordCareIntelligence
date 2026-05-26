package fordcare_api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeadStatusUpdateRequest {

    @NotBlank(message = "O status é obrigatório")
    @Pattern(
            regexp = "NEW|CONTACTED|CONVERTED|LOST",
            message = "Status inválido. Use NEW, CONTACTED, CONVERTED ou LOST"
    )
    private String status;
}