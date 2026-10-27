#!/usr/bin/env python3
"""Restore missing public pinned assets without upgrading any consumer pin."""
import pathlib,importlib.util,argparse
R=pathlib.Path(__file__).resolve().parents[1]
p=argparse.ArgumentParser();p.add_argument('apps',nargs='*');a=p.parse_args();
if set(a.apps)-{'site','approach-2','approach-3'}:p.error('Unknown app')
spec=importlib.util.spec_from_file_location('public_foundation',R/'shared-foundation/tools/manage.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
for app in a.apps or ['site','approach-2','approach-3']:m.restore_consumer(R/app)
