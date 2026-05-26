package fordcare_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="customer_id")
    private Long customerId;

    @Column(name="risk_score")
    private BigDecimal riskScore;

    @Column(name="risk_level")
    private String riskLevel;

    @Column(name="customer_profile")
    private String customerProfile;

    @Column(name="model_version")
    private String modelVersion;

    @Column(name="created_at")
    private LocalDateTime createdAt;
}