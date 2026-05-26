package fordcare_api.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="customer_id")
    private Long customerId;

    private String vin;
    private String model;
    private Integer year;

    @Column(name="last_service_date")
    private LocalDate lastServiceDate;

    @Column(name="warranty_active")
    private Boolean warrantyActive;

    @Column(name="created_at")
    private LocalDateTime createdAt;
}