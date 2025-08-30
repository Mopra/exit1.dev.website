---
title: "Real-Time Alerts: Speed or Bleed Money"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Real-time catches issues fast, minimizes loss."
readTime: "4 min read"
metaDescription: "Why real-time alerts matter: Cut downtime, save money."
---

# Real-Time Alerts: Don't Delay

Delays cost. Real-time fixes quick.

## Why Immediate

E-comm: Gateway fail 2PM, 5-min detect 2:05, fix 2:25 (25 min loss), $50k gone. 1-min: Detect 2:01, fix 2:21 (21 min), saves $40k.

SaaS: DB issue 10:30, 5-min detect 10:35, restart 10:37 (7 min), 200 tickets. 1-min: 10:31 detect, 10:33 restart (3 min), 80 tickets.

API: 500s 8 min undetected, cascades. Real-time stops it.

## Benefits

### Quick Response

- Seconds notify
- Stop escalation
- Mobilize fast
- Communicate proactive

### Less Downtime

- Faster fixes
- Fewer users hit
- Trust preserved
- Losses lowered

### Better UX

- Always available
- Seamless
- Perf maintained
- Confidence built

### Team Boost

- Solve focused
- Less stress
- Better balance
- Data decisions

## Alert Types

### Availability

HTTP:
```javascript
const availability = {
  trigger: {
    statusCode: [500, 502, 503, 504],
    consecutiveFailures: 1,
    timeout: 30000
  },
  notification: {
    channels: ['slack', 'email', 'sms'],
    severity: 'critical',
    escalation: {
      afterMinutes: 5,
      toTeam: 'on-call'
    }
  }
};
```

DNS/connectivity, SSL, CDN.

### Performance

Response:
```yaml
response_time_alerts:
  warning_threshold: 2000ms
  critical_threshold: 5000ms
  measurement_window: 3

  actions:
    warning:
      - notify_chat
      - log_issue
    critical:
      - page_engineer
      - auto_scale
      - notify_stakeholders
```

Resource: CPU, memory, disk, DB pools.

### Biz Logic

Journeys: Reg, payment, search, APIs.

Custom: Cart abandon, login success, uploads, integrations.

## Setup

### Channels

Multi:
```python
class Notifier:
    def __init__(self):
        self.channels = {
            'slack': SlackNotifier(),
            'discord': DiscordNotifier(),
            'email': EmailNotifier(),
            'sms': SMSNotifier(),
            'webhook': WebhookNotifier()
        }
    
    def send(self, alert, severity='medium'):
        if severity == 'critical':
            for channel in self.channels.values():
                channel.send_immediate(alert)
        
        elif severity == 'high':
            self.channels['slack'].send(alert)
            self.channels['email'].send(alert)
            self.channels['webhook'].send(alert)
        
        elif severity == 'medium':
            self.channels['slack'].send(alert)
            self.channels['email'].send(alert)
        
        else:
            self.channels['slack'].send(alert)
```

Team routing: Time, type, expertise, escalation.

### Frequency/Timing

Group:
```javascript
const grouping = {
  groupingWindow: 300000, // 5 min
  
  shouldGroup: (newAlert, groups) => {
    return groups.find(group => 
      group.service === newAlert.service &&
      group.alertType === newAlert.alertType &&
      (Date.now() - group.lastAlert) < groupingWindow
    );
  },
  
  createMessage: (alerts) => ({
    title: `${alerts.length} alerts for ${alerts[0].service}`,
    summary: alerts.map(a => a.message).join('\n'),
    severity: Math.max(...alerts.map(a => a.severity)),
    actions: ['View', 'Ack All', 'Escalate']
  })
};
```

Escalation: 0 min primary, 5 min secondary, 15 min manager, 30 min exec.

### Content

Actionable:
```json
{
  "alert": {
    "title": "API Down - Payments",
    "severity": "critical",
    "timestamp": "2024-01-15T14:30:00Z",
    "service": {
      "name": "Payment API",
      "url": "https://api.example.com/payments",
      "environment": "prod"
    },
    "issue": {
      "status_code": 500,
      "response_time": "timeout",
      "error_message": "Server Error",
      "affected_users": "150+"
    },
    "context": {
      "recent_deployments": "v2.1.3 2 hours ago",
      "traffic_pattern": "normal",
      "dependencies": ["db", "redis", "gateway"]
    },
    "suggested_actions": [
      "Check logs",
      "Verify db",
      "Rollback v2.1.2",
      "Contact gateway"
    ],
    "runbook": "https://docs.company.com/runbooks/payment-api-issues",
    "dashboard": "https://monitor.company.com/payment-api"
  }
}
```

## Quickstart exit1.dev

exit1 add https://api.myapp.com/health \
  --name "API Health" \
  --interval 60 \
  --timeout 30 \
  --expected-status 200 \
  --alert-on-failure \
  --alert-on-recovery

exit1 alert add-channel slack \
  --webhook-url "https://hooks.slack.com/..." \
  --channel "#alerts" \
  --severity critical,high

exit1 alert add-channel discord \
  --webhook-url "https://discord.com/api/webhooks/..." \
  --severity critical

exit1 alert add-channel email \
  --addresses "team@company.com,oncall@company.com" \
  --severity high,medium

## Advanced

### Predictive

Trend:
```javascript
const predictive = {
  metric: 'response_time',
  analysis_window: '15_minutes',
  prediction_window: '5_minutes',
  
  trigger: {
    trend_direction: 'increasing',
    trend_slope: 0.2,
    confidence_threshold: 0.8
  },
  
  action: {
    message: "Response time trending up - issue brewing",
    severity: 'warning',
    suggested_actions: [
      'Check resources',
      'Review deploys',
      'Monitor spikes'
    ]
  }
};
```

### Context Alerting

Business-aware:
```python
import datetime

class AwareAlerting:
    def __init__(self):
        self.business_hours = {
            'start': 9,
            'end': 17,
            'timezone': 'UTC',
            'weekdays_only': True
        }
    
    def adjust_severity(self, base_severity, timestamp):
        dt = datetime.datetime.fromtimestamp(timestamp)
        
        if self.is_business_hours(dt):
            severity_map = {
                'low': 'medium',
                'medium': 'high',
                'high': 'critical'
            }
            return severity_map.get(base_severity, base_severity)
        
        elif base_severity in ['low', 'medium']:
            return base_severity  # Delay escalation
        
        return base_severity
```

## Conclusion

Real-time necessary. Implement smart.

exit1.dev foundation: 1-min checks, global, intelligent alerts. With config, escalation, improvement, first defense.

Goal: Right alerts, right time, right info. Reduces stress, boosts efficiency, keeps sites running.

*Try exit1.dev [here](https://exit1.dev). Alerts that help, not overwhelm.* 

## Sources

- Google SRE Book: Monitoring Distributed Systems — https://sre.google/sre-book/monitoring-distributed-systems/
- AWS Well-Architected: Reliability Pillar — https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html
