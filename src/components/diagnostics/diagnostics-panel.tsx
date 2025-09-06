import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface AppInfo {
  isPackaged: boolean;
  isReady: boolean;
  platform: string;
  arch: string;
  cwd: string;
  userDataPath: string;
  documentsPath: string;
  tempPath: string;
}

export function DiagnosticsPanel() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [logPath, setLogPath] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string>("");

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const loadDiagnostics = async () => {
    try {
      const info = await window.electronAPI.diagnostics.getAppInfo();
      const path = await window.electronAPI.diagnostics.getLogPath();

      setAppInfo(info);
      setLogPath(path);
    } catch (error) {
      console.error("Failed to load diagnostics:", error);
    }
  };

  const testLogging = async () => {
    try {
      const result = await window.electronAPI.diagnostics.testLog(
        "Test message from diagnostics panel"
      );
      setTestResult(result);
    } catch (error) {
      setTestResult(`Error: ${error}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>App Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          {appInfo && (
            <div className="space-y-2 text-sm">
              <div>
                <strong>Is Packaged:</strong>{" "}
                {appInfo.isPackaged ? "Yes" : "No"}
              </div>
              <div>
                <strong>Is Ready:</strong> {appInfo.isReady ? "Yes" : "No"}
              </div>
              <div>
                <strong>Platform:</strong> {appInfo.platform}
              </div>
              <div>
                <strong>Architecture:</strong> {appInfo.arch}
              </div>
              <div className="flex items-center gap-2">
                <strong>Current Directory:</strong>
                <span className="font-mono text-xs bg-gray-100/10 px-2 py-1 rounded">
                  {appInfo.cwd}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(appInfo.cwd)}
                >
                  Copy
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <strong>User Data Path:</strong>
                <span className="font-mono text-xs bg-gray-100/10 px-2 py-1 rounded">
                  {appInfo.userDataPath}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(appInfo.userDataPath)}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Log File</CardTitle>
        </CardHeader>
        <CardContent>
          {logPath ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs bg-gray-100/10 px-2 py-1 rounded">
                {logPath}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(logPath)}
              >
                Copy Path
              </Button>
            </div>
          ) : (
            <p>Log file path not available</p>
          )}

          <div className="mt-4 space-y-2">
            <Button onClick={testLogging}>Send Test Log Message</Button>
            {testResult && (
              <p className="text-sm text-green-600">{testResult}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>For Development:</strong> Check the console output in VS
            Code terminal
          </p>
          <p>
            <strong>For Packaged App:</strong> Navigate to the log file path
            shown above and open app.log
          </p>
          <p>
            <strong>Windows Log Location (Packaged):</strong> Usually in
            %APPDATA%\CodeVille POS\logs\app.log
          </p>
          <p>
            <strong>Manual Path:</strong> Copy the User Data Path above, then
            add \logs\app.log
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
