#!/bin/bash
set -e

ROOT_DIR="$(pwd)"
TOOLS_DIR="$ROOT_DIR/tools"
mkdir -p "$TOOLS_DIR"

echo "=== 1. Checking JDK 17 ==="
if ! command -v javac &> /dev/null; then
    echo "Installing OpenJDK 17..."
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" openjdk-17-jdk-headless wget unzip curl file
fi
java -version

echo "=== 2. Setting up Android SDK ==="
export ANDROID_HOME="$TOOLS_DIR/android-sdk"
mkdir -p "$ANDROID_HOME/cmdline-tools"

if [ ! -d "$ANDROID_HOME/cmdline-tools/latest" ]; then
    echo "Downloading Android Commandline Tools..."
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O /tmp/cmdline-tools.zip
    unzip -q /tmp/cmdline-tools.zip -d "$ANDROID_HOME/cmdline-tools"
    mv "$ANDROID_HOME/cmdline-tools/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"
    rm -f /tmp/cmdline-tools.zip
fi

export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "Accepting licenses..."
yes | sdkmanager --licenses >/dev/null 2>&1 || true

if [ ! -d "$ANDROID_HOME/platforms/android-35" ] || [ ! -d "$ANDROID_HOME/build-tools/35.0.0" ]; then
    echo "Installing Android SDK platforms and build-tools..."
    sdkmanager "platforms;android-35" "build-tools;35.0.0" "platform-tools" >/dev/null 2>&1
fi

echo "=== 3. Setting up Gradle ==="
GRADLE_BIN="$TOOLS_DIR/gradle-8.9/bin/gradle"
if [ ! -f "$GRADLE_BIN" ]; then
    echo "Downloading Gradle 8.9..."
    wget -q https://services.gradle.org/distributions/gradle-8.9-bin.zip -O /tmp/gradle.zip
    unzip -q /tmp/gradle.zip -d "$TOOLS_DIR"
    rm -f /tmp/gradle.zip
fi

echo "Gradle version:"
"$GRADLE_BIN" -v

echo "=== 4. Building APK ==="
cd "$ROOT_DIR/android"
"$GRADLE_BIN" assembleDebug --no-daemon --stacktrace
cd "$ROOT_DIR"

echo "=== 5. Copying APK to required destinations ==="
APK_SOURCE=$(find "$ROOT_DIR/android/app/build/outputs/apk/debug/" -name "*.apk" | head -n 1)

if [ -z "$APK_SOURCE" ] || [ ! -f "$APK_SOURCE" ]; then
    echo "ERROR: APK file was not produced by Gradle!"
    exit 1
fi

mkdir -p "$ROOT_DIR/.build-outputs"
mkdir -p "$ROOT_DIR/APK_DOWNLOAD"
mkdir -p "$ROOT_DIR/public/downloads"

cp -f "$APK_SOURCE" "$ROOT_DIR/.build-outputs/app-debug.apk"
cp -f "$APK_SOURCE" "$ROOT_DIR/.build-outputs/cricket-universe.apk"
cp -f "$APK_SOURCE" "$ROOT_DIR/APK_DOWNLOAD/app-debug.apk"
cp -f "$APK_SOURCE" "$ROOT_DIR/APK_DOWNLOAD/cricket-universe.apk"
cp -f "$APK_SOURCE" "$ROOT_DIR/public/cricket-universe.apk"
cp -f "$APK_SOURCE" "$ROOT_DIR/public/CricketUniverse.apk"
cp -f "$APK_SOURCE" "$ROOT_DIR/public/downloads/cricket-universe.apk"

echo "=== 6. Verifying generated APK ==="
ls -lh "$ROOT_DIR/.build-outputs/app-debug.apk"
ls -lh "$ROOT_DIR/APK_DOWNLOAD/app-debug.apk"
ls -lh "$ROOT_DIR/public/cricket-universe.apk"

FILE_SIZE=$(stat -c%s "$ROOT_DIR/APK_DOWNLOAD/app-debug.apk" 2>/dev/null || stat -f%z "$ROOT_DIR/APK_DOWNLOAD/app-debug.apk")
echo "APK Size in bytes: $FILE_SIZE"

if [ "$FILE_SIZE" -lt 1048576 ]; then
    echo "ERROR: APK is smaller than 1MB ($FILE_SIZE bytes)"
    exit 1
fi

file "$ROOT_DIR/APK_DOWNLOAD/app-debug.apk"
unzip -l "$ROOT_DIR/APK_DOWNLOAD/app-debug.apk" | head -n 25

# Generate apk-info.json with real sha256 and size
SHA256_HEX=$(sha256sum "$ROOT_DIR/public/cricket-universe.apk" | awk '{print $1}')
SIZE_MB=$(awk "BEGIN {printf \"%.2f\", $FILE_SIZE/1048576}")

cat <<EOF > "$ROOT_DIR/public/apk-info.json"
{
  "fileName": "cricket-universe.apk",
  "versionName": "2.5.0",
  "versionCode": 250,
  "packageName": "com.cricketuniverse.app",
  "appName": "Cricket Universe",
  "minSdk": 26,
  "targetSdk": 35,
  "buildDate": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "sizeBytes": $FILE_SIZE,
  "sizeFormatted": "${SIZE_MB} MB ($FILE_SIZE bytes)",
  "sha256": "$SHA256_HEX",
  "downloadUrl": "/api/apk/download"
}
EOF

echo "=== SUCCESS: Valid real APK generated and verified ==="
