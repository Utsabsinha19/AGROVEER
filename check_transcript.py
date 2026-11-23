import json

with open(r'C:\Users\Utsab Sinha\.gemini\antigravity\brain\812ca995-a4c5-4dcd-90ae-11d9dbadb893\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if '928410' in line:
            obj = json.loads(line)
            print(f"Step {obj.get('step_index')}:")
            tc = obj.get('tool_calls', [])
            for c in tc:
                print("Tool call:", c.get('name'), str(c.get('parameters', {}))[:200])
            content = obj.get('content', '')
            if content:
                print("Content:", content[:300])
