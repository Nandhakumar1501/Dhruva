import os
import subprocess
import time

def run_git(args):
    subprocess.run(["git"] + args, check=True)

# Ignore these directories to speed things up and avoid committing build artifacts
IGNORE_DIRS = {".git", "__pycache__", "node_modules", ".next", "screenshots"}
# Ignore these specific files
IGNORE_FILES = {"chunk_commit.py", "seed.json"}

def process_file(filepath):
    print(f"Processing {filepath}")
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
            
        # Try to decode as text, if it fails, it's binary
        try:
            text_content = content.decode('utf-8')
            lines = text_content.splitlines(keepends=True)
        except UnicodeDecodeError:
            # Binary file: just commit it in one go
            run_git(["add", filepath])
            run_git(["commit", "-m", f"Add binary file {os.path.basename(filepath)}"])
            return

        if not lines:
            run_git(["add", filepath])
            run_git(["commit", "-m", f"Add empty file {os.path.basename(filepath)}"])
            return

        # Empty the file initially
        with open(filepath, 'w', encoding='utf-8') as f:
            pass

        # Append in chunks
        chunk_size = 20 # Lines per commit
        for i in range(0, len(lines), chunk_size):
            chunk = lines[i:i+chunk_size]
            with open(filepath, 'a', encoding='utf-8') as f:
                f.writelines(chunk)
            
            run_git(["add", filepath])
            msg = f"Add lines {i+1} to {min(i+chunk_size, len(lines))} in {os.path.basename(filepath)}"
            run_git(["commit", "-m", msg])

    except Exception as e:
        print(f"Failed to process {filepath}: {e}")

def main():
    # Configure git dummy user if not set
    try:
        subprocess.run(["git", "config", "user.name"], check=True, capture_output=True)
    except subprocess.CalledProcessError:
        run_git(["config", "user.name", "Nandhakumar"])
        run_git(["config", "user.email", "nandhakumar@example.com"])

    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            if file in IGNORE_FILES:
                continue
            filepath = os.path.join(root, file)
            filepath = filepath.replace("\\", "/") # Git prefers forward slashes
            if filepath.startswith("./"):
                filepath = filepath[2:]
            process_file(filepath)

if __name__ == "__main__":
    main()
