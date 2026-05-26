package fordcare_api.controller;

import fordcare_api.dto.response.DashboardResponse;
import fordcare_api.service.InsightService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/insights")
public class InsightController {

    private final InsightService insightService;

    public InsightController(InsightService insightService) {
        this.insightService = insightService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard() {
        return insightService.getDashboard();
    }
}