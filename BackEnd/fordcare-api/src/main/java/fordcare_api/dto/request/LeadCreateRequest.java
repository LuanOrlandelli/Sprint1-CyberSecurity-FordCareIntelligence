package fordcare_api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeadCreateRequest {

    @NotNull(message = "O customerId é obrigatório")
    private Long customerId;

    @NotNull(message = "O dealershipId é obrigatório")
    private Long dealershipId;

    @NotBlank(message = "A origem do lead é obrigatória")
    @Size(max = 100, message = "A origem deve ter no máximo 100 caracteres")
    private String origin;

    @Size(max = 500, message = "As observações devem ter no máximo 500 caracteres")
    private String notes;
}