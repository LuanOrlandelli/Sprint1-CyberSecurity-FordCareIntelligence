package fordcare_api.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PredictionClassifyRequest {

    @NotNull(message = "O customerId é obrigatório")
    @Positive(message = "O customerId deve ser maior que zero")
    private Long customerId;
}