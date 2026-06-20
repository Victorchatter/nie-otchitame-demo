#!/usr/bin/env php
<?php
/**
 * health_check.php
 *
 * CLI health checker for the Nie Otchitame FastAPI backend.
 * Demonstrates PHP skills from the job posting.
 *
 * Usage:
 *   php health_check.php --url=http://localhost:8000/health
 *   php health_check.php --url=http://localhost:8000/health --log=/var/log/app.log
 */

/**
 * Minimal argument parser supporting `--key=value` and `--key value`.
 *
 * @param array $argv command-line arguments
 * @return array associative array of parsed options
 */
function parseArgs(array $argv): array {
    $options = [];
    $count = count($argv);
    for ($i = 1; $i < $count; $i++) {
        $arg = $argv[$i];
        if (str_starts_with($arg, '--')) {
            $parts = explode('=', substr($arg, 2), 2);
            $key = $parts[0];
            if (count($parts) === 2) {
                $options[$key] = $parts[1];
            } elseif ($i + 1 < $count && !str_starts_with($argv[$i + 1], '--')) {
                $options[$key] = $argv[++$i];
            } else {
                $options[$key] = true;
            }
        }
    }
    return $options;
}

/**
 * Calls the backend health endpoint and returns decoded JSON or an error string.
 *
 * @param string $url health endpoint URL
 * @return array{status: string, errors: string[], raw: string}
 */
function checkHealth(string $url): array {
    $errors = [];
    $raw = '';
    $status = 'unknown';

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 5,
            'header' => "Accept: application/json\r\n",
        ],
    ]);

    $response = @file_get_contents($url, false, $context);
    if ($response === false) {
        $errors[] = "Failed to reach $url";
        return [
            'status' => 'unreachable',
            'errors' => $errors,
            'raw' => $raw,
        ];
    }

    $raw = trim($response);
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        $errors[] = 'Response is not valid JSON';
        $status = 'invalid';
    } else {
        $status = $data['status'] ?? 'unknown';
    }

    return [
        'status' => $status,
        'errors' => $errors,
        'raw' => $raw,
    ];
}

/**
 * Scans a log file for ERROR lines.
 *
 * @param string $logPath path to the log file
 * @return string[] list of ERROR lines
 */
function scanErrors(string $logPath): array {
    $errors = [];
    if (!file_exists($logPath) || !is_readable($logPath)) {
        return ["Log file not readable: $logPath"];
    }

    $handle = fopen($logPath, 'r');
    if (!$handle) {
        return ["Could not open log file: $logPath"];
    }

    while (($line = fgets($handle)) !== false) {
        if (str_contains(strtoupper($line), 'ERROR')) {
            $errors[] = rtrim($line);
        }
    }
    fclose($handle);
    return $errors;
}

// ---- main ----

$options = parseArgs($argv);
$url = $options['url'] ?? 'http://localhost:8000/health';
$logPath = $options['log'] ?? null;

print "Health endpoint: $url\n";

$health = checkHealth($url);

print "HTTP status: {$health['status']}\n";
print "Raw response: {$health['raw']}\n";

if (!empty($health['errors'])) {
    print "Connection errors:\n";
    foreach ($health['errors'] as $err) {
        print "  - $err\n";
    }
    exit(1);
}

if ($health['status'] !== 'ok') {
    print "Backend is NOT healthy.\n";
    exit(1);
}

print "Backend is healthy.\n";

if ($logPath !== null) {
    print "\nScanning log file: $logPath\n";
    $logErrors = scanErrors($logPath);
    if (empty($logErrors)) {
        print "No ERROR lines found.\n";
    } else {
        print "Found " . count($logErrors) . " ERROR line(s):\n";
        foreach (array_slice($logErrors, 0, 20) as $line) {
            print "  $line\n";
        }
        if (count($logErrors) > 20) {
            print "  ... and " . (count($logErrors) - 20) . " more\n";
        }
    }
}

exit(0);
