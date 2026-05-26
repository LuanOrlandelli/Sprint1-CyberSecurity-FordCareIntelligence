package fordcare_api.repository;

import fordcare_api.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    Optional<Prediction> findTopByCustomerIdOrderByCreatedAtDesc(Long customerId);

    Long countByRiskLevel(String riskLevel);
}