import json
from openai import OpenAI

client = OpenAI()

def evaluate_response(question, user_response):
    prompt = f"""
You are simulating a senior-level behavioral interview for a software engineering candidate.

Here is the question:
"{question}"

Here is the candidate's answer:
\"\"\"{user_response}\"\"\"

Your task is to evaluate the answer strictly using the STAR method:
- **Situation**: Did they provide relevant background and context?
- **Task**: Did they clearly state their responsibility or challenge?
- **Action**: Did they explain specific steps they took?
- **Result**: Did they describe a measurable or observable outcome?

You MUST also assess whether the candidate actually answered the question being asked. Penalize clarity or completeness if they went off-topic, missed the point, or gave a generic answer.

### Instructions:
- Do NOT assume intent. Only evaluate what is explicitly stated.
- Give **lower completeness scores** if any part of STAR is implied but not directly described.
- Give **lower clarity scores** if a section is confusing, vague, or wordy.
- Do NOT include compliments unless relevant to performance. Stay professional and precise.
- You MUST respond strictly in the JSON format below.

Expected JSON format:
{{
  "situation": {{
    "response": "...",
    "clarity_score": ...,
    "completeness_score": ...
  }},
  "task": {{
    "response": "...",
    "clarity_score": ...,
    "completeness_score": ...
  }},
  "action": {{
    "response": "...",
    "clarity_score": ...,
    "completeness_score": ...
  }},
  "result": {{
    "response": "...",
    "clarity_score": ...,
    "completeness_score": ...
  }},
  "overall_score": "...",
  "feedback": "Summarize areas of strength and improvement. Be blunt but fair. Highlight whether they answered the actual question or not."
}}
"""

    res = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a senior engineering interviewer."},
            {"role": "user", "content": prompt}
        ]
    )

    content = res.choices[0].message.content.strip()

    try:
        parsed_json = json.loads(content)
        return parsed_json
    except json.JSONDecodeError as e:
        raise ValueError(f"OpenAI response is not valid JSON:\n{content}\n\nError: {e}")
