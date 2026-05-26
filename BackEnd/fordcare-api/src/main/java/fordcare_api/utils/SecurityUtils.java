package fordcare_api.utils;

public class SecurityUtils {

    public static String sanitize(String value) {

        if (value == null) {
            return null;
        }

        return value
                .trim()
                .replaceAll("<", "")
                .replaceAll(">", "")
                .replaceAll("script", "")
                .replaceAll("\"", "")
                .replaceAll("'", "");
    }
}