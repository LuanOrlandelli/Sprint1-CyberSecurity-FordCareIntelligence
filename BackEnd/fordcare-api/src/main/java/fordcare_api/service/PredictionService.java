package fordcare_api.service;

import fordcare_api.dto.request.PredictionClassifyRequest;
import fordcare_api.dto.response.PredictionClassifyResponse;
import fordcare_api.entity.Prediction;
import fordcare_api.entity.Recommendation;
import fordcare_api.repository.CustomerRepository;
import fordcare_api.repository.PredictionRepository;
import fordcare_api.repository.RecommendationRepository;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class PredictionService {

    private final CustomerRepository customerRepository;
    private final PredictionRepository predictionRepository;
    private final RecommendationRepository recommendationRepository;
    private final AuditService auditService;

    public PredictionService(
            CustomerRepository customerRepository,
            PredictionRepository predictionRepository,
            RecommendationRepository recommendationRepository,
            AuditService auditService
    ) {
        this.customerRepository = customerRepository;
        this.predictionRepository = predictionRepository;
        this.recommendationRepository = recommendationRepository;
        this.auditService = auditService;
    }

    public PredictionClassifyResponse classify(PredictionClassifyRequest request, HttpServletRequest httpRequest) {

        customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        BigDecimal riskScore = generateFakeRiskScore(request.getCustomerId());
        String riskLevel = defineRiskLevel(riskScore);
        String customerProfile = defineCustomerProfile(riskLevel);
        String recommendationText = defineRecommendation(riskLevel);

        Prediction prediction = new Prediction();
        prediction.setCustomerId(request.getCustomerId());
        prediction.setRiskScore(riskScore);
        prediction.setRiskLevel(riskLevel);
        prediction.setCustomerProfile(customerProfile);
        prediction.setModelVersion("simulated-v1.0");
        prediction.setCreatedAt(LocalDateTime.now());

        Prediction savedPrediction = predictionRepository.save(prediction);

        Recommendation recommendation = new Recommendation();
        recommendation.setCustomerId(request.getCustomerId());
        recommendation.setPredictionId(savedPrediction.getId());
        recommendation.setTitle("Recomendação automática de retenção");
        recommendation.setDescription(recommendationText);
        recommendation.setPriority(riskLevel);
        recommendation.setCreatedAt(LocalDateTime.now());

        recommendationRepository.save(recommendation);

        auditService.register(
                "CUSTOMER_CLASSIFIED_BY_AI",
                "SYSTEM",
                "/predictions/classify",
                httpRequest.getRemoteAddr()
        );

        return new PredictionClassifyResponse(
                request.getCustomerId(),
                riskScore,
                riskLevel,
                customerProfile,
                recommendationText
        );
    }

    private BigDecimal generateFakeRiskScore(Long customerId) {
        if (customerId % 3 == 0) {
            return new BigDecimal("0.25");
        } else if (customerId % 2 == 0) {
            return new BigDecimal("0.55");
        } else {
            return new BigDecimal("0.82");
        }
    }

    private String defineRiskLevel(BigDecimal riskScore) {
        if (riskScore.compareTo(new BigDecimal("0.70")) >= 0) {
            return "HIGH";
        } else if (riskScore.compareTo(new BigDecimal("0.40")) >= 0) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    private String defineCustomerProfile(String riskLevel) {
        return switch (riskLevel) {
            case "HIGH" -> "Cliente com alto risco de evasão da rede autorizada";
            case "MEDIUM" -> "Cliente com risco moderado de evasão";
            default -> "Cliente com baixo risco de evasão";
        };
    }

    private String defineRecommendation(String riskLevel) {
        return switch (riskLevel) {
            case "HIGH" -> "Entrar em contato imediatamente e oferecer revisão com benefício personalizado.";
            case "MEDIUM" -> "Enviar lembrete preventivo de manutenção e acompanhar retorno.";
            default -> "Manter relacionamento com comunicações periódicas.";
        };
    }
}