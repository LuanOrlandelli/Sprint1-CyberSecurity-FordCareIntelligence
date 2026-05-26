package fordcare_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "recommendations")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="customer_id")
    private Long customerId;

    @Column(name="prediction_id")
    private Long predictionId;

    private String title;
    private String description;
    private String priority;

    @Column(name="created_at")
    private LocalDateTime createdAt;
}