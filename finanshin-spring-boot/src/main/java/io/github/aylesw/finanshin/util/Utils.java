package io.github.aylesw.finanshin.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class Utils {
    public static String normalizeString(String input) {
        String normalizedString = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return pattern.matcher(normalizedString).replaceAll("");
    }
}
