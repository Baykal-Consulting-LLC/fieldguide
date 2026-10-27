"""Compatibility alias: checks this consumer's pin and boundary, never freezes Approach 1."""
from pathlib import Path
import subprocess,sys
root=Path(__file__).resolve().parents[1]
sys.exit(subprocess.run([sys.executable,str(root/'scripts/shared-foundation.py'),'check'],cwd=root).returncode)
