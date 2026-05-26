package fordcare_api.service;

import fordcare_api.entity.AuditLog;
import fordcare_api.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void register(
            String action,
            String username,
            String endpoint,
            String ipAddress
    ) {

        AuditLog auditLog = new AuditLog();

        auditLog.setAction(action);
        auditLog.setUsername(username);
        auditLog.setEndpoint(endpoint);
        auditLog.setIpAddress(ipAddress);

        auditLogRepository.save(auditLog);
    }
}