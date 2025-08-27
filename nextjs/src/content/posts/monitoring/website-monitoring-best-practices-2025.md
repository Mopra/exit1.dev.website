---
title: "Monitoring Practices 2025: What Pros Do"
author: "Morten Pradsgaard"
category: "monitoring"
excerpt: "Pro tips from Hotjar, Better Stack, Robotalp."
readTime: "11 min read"
metaDescription: "Monitoring best practices 2025: Pro tips."
---

# Monitoring 2025: Pro Tips

Monitoring now predictive, user-focused, AI-powered.

Basics: [101](/blog/website-monitoring-101).

2. [Framework](#framework)
4. [Advanced](#advanced)
6. [Perf](#perf)
8. [Team](#team)
10. [Pitfalls](#pitfalls)

## Landscape {#landscape}

### Trends

Reactive to predictive.

Uptime to UX.

Thresholds to ML.

### Benchmarks

Load: <1.5s expected.

API: <200ms.

Interactive: <2s.

Checks: 1-min min, 30s critical.

Locations: 10+.

## Framework {#framework}

4 layers.

### Infra

Net:
```bash
dig @8.8.8.8 site.com
dig @1.1.1.1 site.com
dig @208.67.222.222 site.com
```

Server:
```python
monitors = [
    {"type": "icmp", "target": "site.com", "interval": "30s"},
    {"type": "tcp", "target": "site.com:443", "interval": "30s"},
    {"type": "http", "target": "https://site.com", "interval": "30s"},
    {"type": "dns", "target": "site.com", "interval": "60s"}
]
```

Tip: Monitor TCP separate from HTTP.

### App Perf

Response:
```javascript
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      sendMetric('lcp', entry.startTime);
    }
    if (entry.entryType === 'first-input') {
      sendMetric('fid', entry.processingStart - entry.startTime);
    }
  }
}).observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });

let cls = 0;
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (!entry.hadRecentInput) {
      cls += entry.value;
    }
  }
  sendMetric('cls', cls);
}).observe({ entryTypes: ['layout-shift'] });
```

DB:
```python
class DBMonitor:
    def monitor_queries(self):
        slow = self.get_slow_queries()
        
        for q in slow:
            pattern = self.extract_pattern(q['sql'])
            
            if self.is_new_slow(pattern):
                self.alert_new_slow(q, pattern)
            
            self.update_trends(pattern, q['duration'])
    
    def monitor_pool(self):
        stats = self.get_pool_stats()
        
        util = stats['active'] / stats['max_connections']
        
        if util > 0.8:
            self.alert_high_usage(util, stats)
        
        if self.predict_exhaustion(stats):
            self.alert_predicted_exhaustion(stats)
    
    def monitor_replication(self):
        for rep in self.get_replicas():
            lag = self.get_lag(rep)
            
            if lag > threshold:
                self.alert_lag(rep, lag)
            
            if not self.verify_consistency(rep):
                self.alert_inconsistency(rep)
```

Trend tracking over absolute.

### UX Validation

Synthetic:
```javascript
async function monitorJourney() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1366, height: 768 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    geolocation: { longitude: -74.006, latitude: 40.7128 },
    permissions: ['geolocation']
  });
  
  const page = await context.newPage();
  
  const start = Date.now();
  
  try {
    await page.goto('https://example.com', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    await page.fill('[data-testid="search-input"]', 'test-product-123');
    await page.click('[data-testid="search-button"]');
    await page.waitForSelector('[data-testid="search-results"]');
    
    await page.click('[data-testid="product-card"]:first-child');
    await page.waitForSelector('[data-testid="add-to-cart-button"]');
    await page.click('[data-testid="add-to-cart-button"]');
    
    await page.waitForSelector('[data-testid="cart-count"]');
    const count = await page.textContent('[data-testid="cart-count"]');
    
    if (count !== '1') {
      throw new Error(`Cart count wrong: ${count}`);
    }
    
    const totalTime = Date.now() - start;
    
    await recordMetric('journey_success', 1);
    await recordMetric('journey_duration', totalTime);
    
    return { success: true, duration: totalTime };
  } catch (error) {
    await recordMetric('journey_failure', 1);
    throw error;
  } finally {
    await browser.close();
  }
}
```

Mobile:
```javascript
async function monitorMobile() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 12 Pro'],
    offline: false,
    downloadThroughput: 1.5 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8,
    latency: 40
  });
  
  const page = await context.newPage();
  
  await page.evaluateOnNewDocument(() => {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        fetch('/api/metrics', {
          method: 'POST',
          body: JSON.stringify({
            type: entry.entryType,
            value: entry.value || entry.startTime,
            timestamp: Date.now(),
            userAgent: 'mobile-monitor',
            connection: navigator.connection?.effectiveType
          })
        });
      }
    }).observe({entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift']});
  });
  
  await page.goto('https://example.com');
  // ... tests
}
```

### Biz Impact

Revenue:
```python
class BizMonitor:
    def __init__(self):
        pass  # implementation as above
```

## Alert/Incident {#alert-optimization}

Quality over quantity.

### Smart Routing

Context-aware:
```python
class ContextualAlerter:
    def __init__(self):
        self.escalation = self.load_escalation()
        self.schedules = self.load_schedules()
        
    def route(self, alert):
        context = self.gather(alert)
        return self.determine(alert, context)
    
    def gather(self, alert):
        return {
            'time_of_day': datetime.now().hour,
            'day_of_week': datetime.now().weekday(),
            'recent_deploys': self.check_deploys(),
            'incidents': self.get_active(),
            'dependencies': self.get_deps(alert.service),
            'user_impact': self.estimate_user(alert),
            'revenue_impact': self.estimate_revenue(alert)
        }
    
    def determine(self, alert, context):
        if context['time_of_day'] < 9 or context['time_of_day'] > 17:
            if alert.severity in ['critical', 'emergency']:
                return self.get_oncall()
            else:
                return {'channels': ['email'], 'delay': '15m'}
        
        if context['recent_deploys']:
            return {
                'channels': ['slack', 'email'],
                'recipients': context['recent_deploys']['team'],
                'escalation_delay': '5m'
            }
        
        if context['revenue_impact'] > 1000:
            return {
                'channels': ['sms', 'phone', 'slack'],
                'recipients': ['oncall', 'lead'],
                'escalation_delay': '10m'
            }
        
        return {
            'channels': ['slack', 'email'],
            'recipients': ['team'],
            'escalation_delay': '30m'
        }
```

Fatigue prevention:
```python
class Suppressor:
    def __init__(self):
        self.rules = [
            {
                'name': 'Flapping',
                'condition': 'same_alert_3_times_in_15_minutes',
                'action': 'suppress_1_hour',
                'escalation': 'notify_lead'
            },
            {
                'name': 'Maintenance',
                'condition': 'maintenance_active',
                'action': 'suppress_all',
                'exceptions': ['security', 'external_fails']
            },
            {
                'name': 'Deployment',
                'condition': 'deploy_progress',
                'action': 'suppress_perf_30_minutes',
                'exceptions': ['availability']
            }
        ]
    
    def should_suppress(self, alert):
        for rule in self.rules:
            if self.evaluate(rule['condition'], alert):
                self.apply(rule['action'], alert)
                return True
        return False
```

### Incident Integration

Auto create:
```python
class IncidentMgr:
    def __init__(self):
        self.jira = JiraClient()
        self.pagerduty = PagerDutyClient()
        self.slack = SlackClient()
    
    def handle_critical(self, alert):
        incident = self.create_ticket(alert)
        
        war_room = self.create_channel(incident.id, alert)
        
        self.notify_stakeholders(alert, incident, war_room)
        
        self.run_diagnostics(alert)
        
        return incident
    
    def create_ticket(self, alert):
        data = {
            'summary': f"[P1] {alert.service} - {alert.description}",
            'description': self.generate_desc(alert),
            'priority': self.map_priority(alert.severity),
            'labels': ['monitoring', 'auto', alert.service],
            'assignee': self.get_oncall()
        }
        
        return self.jira.create_issue(data)
    
    def create_channel(self, id, alert):
        name = f"incident-{id}-{alert.service}"
        
        channel = self.slack.create_channel(
            name=name,
            purpose=f"War room for {id}"
        )
        
        team = self.get_members(alert.service)
        self.slack.invite_users(channel.id, team)
        
        self.slack.post_message(
            channel=channel.id,
            text=f"🚨 Incident {id} - {alert.description}",
            attachments=self.format_slack(alert)
        )
        
        return channel
```

## Perf Excellence {#perf}

Technical and biz.

### Vitals Opt

Tracking:
```javascript
class PerfMonitor {
  constructor() {
    this.metrics = {};
    this.thresholds = {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };
    
    this.initObservers();
  }
  
  initObservers() {
    // LCP, FID, CLS observers as above
    
    this.trackCustom();
  }
  
  trackCustom() {
    const nav = performance.getEntriesByType('navigation')[0];
    if (nav) {
      const ttfb = nav.responseStart - nav.requestStart;
      this.update('ttfb', ttfb);
    }
    
    const resources = performance.getEntriesByType('resource');
    const js = resources.filter(r => r.name.includes('.js'));
    const totalJS = js.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    this.update('js_size', totalJS);
    
    this.trackAPI();
  }
  
  update(name, value) {
    this.metrics[name] = value;
    
    if (this.thresholds[name]) {
      const quality = this.assess(name, value);
      this.report(name, value, quality);
    }
  }
  
  assess(metric, value) {
    const t = this.thresholds[metric];
    if (value <= t.good) return 'good';
    if (value <= t.poor) return 'needs_improvement';
    return 'poor';
  }
  
  report(name, value, quality) {
    fetch('/api/metrics/perf', {
      method: 'POST',
      body: JSON.stringify({
        metric: name,
        value,
        quality,
        timestamp: Date.now(),
        page: location.pathname,
        ua: navigator.userAgent,
        conn: navigator.connection?.effectiveType
      })
    });
  }
}
```

Budget:
```yaml
budgets:
  load_time:
    budget: 3000ms
    warning: 2500ms
    measurement: "interactive"
    
  bundle_size:
    js:
      budget: 200kb
      warning: 150kb
    css:
      budget: 50kb
      warning: 40kb
    images:
      budget: 500kb
      warning: 400kb
      
  vitals:
    lcp:
      good: 2500ms
      improvement: 4000ms
    fid:
      good: 100ms
      improvement: 300ms
    cls:
      good: 0.1
      improvement: 0.25
      
  api:
    p95: 500ms
    error: 1%
    throughput: 1000_rps
```

### Backend

DB monitoring:
```python
class DBMonitor:
    # as above
```

## Security/Compliance {#security-compliance}

Integrate monitoring.

### Security

SSL:
```python
class SecMonitor:
    def __init__(self):
        self.ssl = SSLChecker()
        self.headers = HeadersChecker()
        
    def ssl_check(self, domain):
        results = {
            'validity': self.check_validity(domain),
            'chain': self.verify_chain(domain),
            'protocol': self.check_protocol(domain),
            'ciphers': self.analyze_ciphers(domain),
            'headers': self.check_headers(domain),
            'hsts': self.check_hsts(domain),
            'ct': self.verify_ct(domain)
        }
        
        score = self.calc_score(results)
        
        if score < 80:
            self.alert_concern(domain, results, score)
        
        return results
    
    def check_headers(self, domain):
        resp = requests.get(f'https://{domain}')
        missing = []
        
        for header in ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy']:
            if header not in resp.headers:
                missing.append(header)
        
        if missing:
            self.alert_missing_headers(domain, missing)
        
        return {
            'present': [h for h in required if h in resp.headers],
            'missing': missing
        }
```

Vuln:
```python
class VulnMonitor:
    def __init__(self):
        self.vuln_db = VulnDB()
        self.scanner = DepScanner()
        
    def monitor_deps(self, path):
        deps = self.scanner.scan(path)
        vulns = []
        
        for dep in deps:
            vs = self.vuln_db.check(dep['name'], dep['version'])
            
            if vs:
                vulns.extend(vs)
        
        critical = [v for v in vulns if v['severity'] == 'critical']
        high = [v for v in vulns if v['severity'] == 'high']
        
        if critical:
            self.alert_critical(critical)
        elif high:
            self.alert_high(high)
        
        return vulns
    
    def monitor_events(self):
        events = self.get_events()
        
        for e in events:
            if self.is_suspicious(e):
                self.alert_suspicious(e)
            
            if self.indicates_breach(e):
                self.alert_breach(e)
```

### Compliance

GDPR:
```python
class CompMonitor:
    def __init__(self):
        self.gdpr = GDPRChecker()
        self.flow = FlowMonitor()
        
    def monitor_gdpr(self):
        checks = {
            'cookie': self.check_cookie(),
            'policy': self.verify_policy(),
            'processing': self.monitor_processing(),
            'retention': self.check_retention(),
            'transfers': self.monitor_transfers(),
            'rights': self.verify_rights()
        }
        
        issues = []
        for name, result in checks.items():
            if not result['compliant']:
                issues.append({
                    'check': name,
                    'issue': result['issue'],
                    'severity': result['severity']
                })
        
        if issues:
            self.alert_issues(issues)
        
        return checks
    
    def monitor_processing(self):
        acts = self.flow.get_activities()
        
        for a in acts:
            if not a.get('lawful_basis'):
                self.alert_missing_basis(a)
            
            if self.is_excessive(a):
                self.alert_excessive(a)
            
            if self.exceeds_retention(a):
                self.alert_retention_violation(a)
```

## Team Processes {#team-processes}

Defined processes, doc.

### Incident Response

Classification:
```yaml
classification:
  P1:
    def: "Outage or breach"
    response: "<5 min"
    escalation: "Immediate"
    comm: "Status + customer"
    stakeholders: ["Eng", "Support", "Mgmt", "Comm"]
    
  P2:
    def: "Major degradation"
    response: "<15 min"
    escalation: "30 min"
    comm: "Internal + status"
    stakeholders: ["Eng", "Support"]
    
  P3:
    def: "Minor impact"
    response: "<1 hour"
    escalation: "4 hours"
    comm: "Internal"
    stakeholders: ["Eng"]

procedures:
  initial:
    - Ack within SLA
    - Assess/classify
    - Create channel/war room
    - Investigate
    - Update status if facing
    
  investigation:
    - Gather logs/metrics
    - Identify causes
    - Temp fixes
    - Update every 15 min
    
  resolution:
    - Permanent fix
    - Verify all systems
    - Update status res
    - Start review
```

Review:
```python
class PIR:
    def __init__(self):
        self.template = self.load_template()
        
    def review(self, incident):
        data = {
            'summary': self.generate_summary(incident),
            'timeline': self.build_timeline(incident),
            'root_cause': self.perform_rca(incident),
            'factors': self.identify_factors(incident),
            'effectiveness': self.assess_effectiveness(incident),
            'actions': self.generate_actions(incident),
            'lessons': self.capture_lessons(incident)
        }
        
        self.schedule_followups(data['actions'])
        
        return data
    
    def generate_actions(self, incident):
        actions = []
        
        if incident.detection_time > timedelta(minutes=5):
            actions.append({
                'category': 'monitoring',
                'desc': 'Improve alert sensitivity',
                'owner': 'monitoring_team',
                'due': datetime.now() + timedelta(weeks=2),
                'priority': 'high'
            })
        
        if incident.response_time > incident.sla_target:
            actions.append({
                'category': 'process',
                'desc': 'Optimize response procedures',
                'owner': 'eng_team',
                'due': datetime.now() + timedelta(weeks=1),
                'priority': 'medium'
            })
        
        if incident.root_cause == 'infra':
            actions.append({
                'category': 'technical',
                'desc': 'Implement redundancy',
                'owner': 'platform_team',
                'due': datetime.now() + timedelta(weeks=4),
                'priority': 'high'
            })
        
        return actions
```

### Doc Standards

Runbook:
```markdown
# Runbook: Payment API

## Overview
- Service: Payment API
- Criticality: P1
- Owner: Payments
- On-call: @payments-oncall

## Metrics
- Response: <200ms p95
- Error: <0.1%
- Throughput: 1000+/min
- Availability: 99.99%

## Common Alerts

### High Response

Alert: payment_api_response_high
Threshold: p95 >500ms 5 min

Steps:
1. Check connection pool
2. Review deploys
3. Examine gateway times
4. Check traffic

Causes:
- DB perf
- Gateway slow
- High volume
- Leak

Resolution:
1. Scale if CPU/memory high
2. Restart if leak
3. Contact gateway
4. Circuit breaker

### High Error

Alert: payment_api_error_high
Threshold: >1% 5 min

Steps:
1. Check logs patterns
2. Verify gateway connect
3. Review config changes
4. Check auth status

## Escalation

0-15: Primary investigate
15-30: Escalate lead
30-45: Escalate manager
45+: Escalate VP

## Contacts

- Lead: @payments-lead
- Manager: @eng-manager
- Gateway: +1-800-GATEWAY

## Recovery

- Breaker: Flag payment_circuit_breaker
- Failover: Backup processor
- Rollback: ./scripts/rollback-payment-api.sh
```

## Tool/Integration {#tool-selection}

Eval matrix:
```yaml
criteria:
  technical:
    - locations: 8
    - frequency: 30_seconds
    - api: required
    - webhook: required
    - protocols: ["http", "tcp", "dns", "ssl"]
    - headers: required
    
  integration:
    - slack: required
    - pagerduty: preferred
    - webhook_flex: required
    - api_limits: ">1000/min"
    - terraform: preferred
    
  business:
    - pricing: "transparent"
    - support: "business_min"
    - sla: "99.9%"
    - retention: "90_days_min"
    - compliance: ["soc2", "gdpr"]
    
  ux:
    - dashboard: "pro"
    - mobile: "preferred"
    - alert_custom: "flex"
    - onboarding: "<1_hour"
    - learning: "moderate"
```

Comparison:
```yaml
comparison:
  exit1_dev:
    strengths:
      - "Unlimited free"
      - "30s checks"
      - "CLI friendly"
      - "Transparent"
      - "Fast setup"
    weaknesses:
      - "Newer"
      - "Small community"
    score: 85
    best_for: ["startups", "devs", "budget"]
    
  better_stack:
    strengths:
      - "Beautiful UI"
      - "Incident mgmt"
      - "Comprehensive"
      - "Enterprise support"
    weaknesses:
      - "Pricing high"
      - "Complex basic"
    score: 88
    best_for: ["enterprise", "ux_teams", "complex"]
    
  uptimerobot:
    strengths:
      - "Established"
      - "50 free"
      - "Simple"
      - "Integrations"
    weaknesses:
      - "5-min free"
      - "Limited advanced"
    score: 75
    best_for: ["simple", "many_sites", "beginners"]
```

### Integration

Multi-tool:
```python
class Stack:
    def __init__(self):
        self.uptime = Exit1DevClient()
        self.obs = DatadogClient()
        self.logs = LogDNAClient()
        self.errors = SentryClient()
        self.status = StatusPageClient()
        
    def setup(self, config):
        uptime = self.create_uptime(config)
        
        perf = self.setup_perf(config)
        
        logs = self.configure_logs(config)
        
        self.setup_alerting(uptime, perf, logs)
        
        return {
            'uptime': uptime,
            'perf': perf,
            'logs': logs
        }
    
    def setup_alerting(self, uptime, perf, logs):
        rules = [
            {
                'name': 'Outage',
                'conditions': [
                    'uptime.status == "down"',
                    'perf.response > 30000',
                    'logs.error_rate > 50'
                ],
                'action': 'critical_incident'
            },
            {
                'name': 'Degradation',
                'conditions': [
                    'uptime.response > 5000',
                    'perf.apdex < 0.8',
                    'error_rate < 5'
                ],
                'action': 'perf_alert'
            }
        ]
        
        self.correlation = AlertCorrelation(rules)
```

## Pitfalls {#pitfalls}

Avoid common errors.

### Thresholds

Static bad:
```python
bad = {
    'response_alert': 1000,
    'error_alert': 1,
    'cpu_alert': 80
}
```

Smart:
```python
class SmartThresholds:
    def __init__(self):
        self.baseline = BaselineCalculator()
        self.context = ContextAnalyzer()
    
    def get(self, name, time):
        baseline = self.baseline.get(name, time, lookback=7)
        
        context = self.context.get(time)
        multiplier = self.get_multiplier(context)
        
        threshold = baseline * 2.0 * multiplier
        
        return threshold
    
    def get_multiplier(self, context):
        mult = 1.0
        
        if context['is_peak_hours']:
            mult *= 1.3
        
        if context['recent_deployment']:
            mult *= 1.5
        
        if context['day_of_week'] in ['saturday', 'sunday']:
            mult *= 0.8
        
        return mult
```

Frequency:
```python
def bad_alert(value, threshold):
    if value > threshold:
        send_alert("Exceeded")  # Spam

class SmartAlert:
    def __init__(self):
        self.states = {}
        self.trend = TrendAnalyzer()
    
    def evaluate(self, name, value, threshold):
        duration = self.get_duration(name, value, threshold)
        
        trend = self.trend.get(name, duration='15m')
        
        should = (
            duration > timedelta(minutes=5) and
            trend.direction == 'worsening' and
            not self.recently_alerted(name, hours=1)
        )
        
        if should:
            self.send(name, value, threshold, trend)
            self.mark_alerted(name)
```

### Over-Monitoring

Monitor key, not all.

Focused:
```python
class Focused:
    def __init__(self):
        self.biz = [
            'reg_rate',
            'payment_success',
            'order_completion',
            'login_success'
        ]
        
        self.tech = [
            'response_time',
            'error_by_service',
            'db_pool',
            'critical_apis'
        ]
        
        self.infra = [
            'cpu_usage',
            'memory_trend',
            'disk_remaining',
            'ssl_expiry'
        ]
    
    def prioritize(self):
        return {
            'p1': self.biz + ['payment_api', 'user_auth'],
            'p2': self.tech,
            'p3': self.infra
        }
```

### Integration

Tool sprawl bad.

Integrated:
```python
class Strategy:
    def __init__(self):
        self.primary = {
            'uptime_synthetic': 'Exit1.dev',
            'observability': 'Datadog',
            'incident': 'PagerDuty',
            'status': 'StatusPage.io'
        }
    
    def setup_integration(self):
        config = {
            'alert_routing': {
                'source': ['exit1.dev', 'datadog'],
                'processor': 'correlation',
                'destination': 'pagerduty'
            },
            'status_updates': {
                'trigger': 'pagerduty_incident',
                'action': 'auto_update_status'
            },
            'data_correlation': {
                'uptime': 'exit1.dev',
                'perf': 'datadog',
                'window': '5_minutes'
            }
        }
        
        return config
```

## Future-Proof {#future-proofing}

Adapt to changes.

### Trends

AI:
```python
class AIEnhanced:
    def __init__(self):
        self.anomaly = AnomalyEngine()
        self.predictive = PredictiveEngine()
        self.auto = AutoRemediation()
        
    def implement_predictive(self):
        self.anomaly.train(
            metrics=['response', 'error', 'throughput'],
            period=timedelta(days=90)
        )
        
        self.predictive.train_capacity(
            features=['traffic', 'seasonal', 'events'],
            target='utilization'
        )
        
        self.auto.define_rules([
            {
                'condition': 'high_memory + leak_pattern',
                'action': 'restart_instances',
                'safety': ['lb_healthy', 'backup_instances']
            },
            {
                'condition': 'db_pool_exhausted',
                'action': 'scale_pool',
                'safety': ['db_perf', 'conn_limits']
            }
        ])
    
    def setup_learning(self):
        pipeline = {
            'feedback': {
                'false_pos': 'dismissals',
                'correlation': 'post_analysis',
                'perf': 'response_accuracy'
            },
            'retraining': {
                'freq': 'weekly',
                'triggers': ['accuracy_drop >10%', 'new_deploy'],
                'validation': 'holdout'
            },
            'adaptation': {
                'method': 'dynamic_baseline',
                'factors': ['seasonal', 'growth', 'infra_changes']
            }
        }
        
        return pipeline
```

Edge:
```python
class EdgeStrategy:
    def __init__(self):
        self.edges = self.discover_edges()
        self.aggregator = Aggregator()
        
    def setup_distributed(self):
        for loc in self.edges:
            monitor = self.deploy_monitor(loc)
            monitor.configure({
                'local_checks': ['health', 'response', 'usage'],
                'interval': 60,
                'alert_threshold': 'critical_only',
                'aggregation': 'local_summary'
            })
        
        self.aggregator.configure({
            'sources': [f'edge_{loc.id}' for loc in self.edges],
            'window': 300,
            'alert_conditions': [
                'multiple_edge_fails',
                'degradation_pattern',
                'regional_issues'
            ]
        })
    
    def monitor_perf(self):
        metrics = [
            'edge_origin_latency',
            'cache_hit_by_loc',
            'sync_lag',
            'local_capacity',
            'net_partition'
        ]
        
        for m in metrics:
            self.setup_monitoring(m, {
                'method': 'distributed',
                'agg_strategy': 'weighted_traffic',
                'correlation': 'cross_location'
            })
```

### Adaptive Systems

Config as code:
```yaml
config:
  version: "2025.1"
  
  service_mesh:
    enabled: true
    provider: "istio"
    integration:
      - distributed_tracing
      - service_metrics
      - auto_signals
      
  kubernetes:
    enabled: true
    resources:
      - pods
      - services
      - ingress
      - volumes
    crds:
      - monitoring_policies
      - alert_rules
      - dashboard_configs
      
  iac:
    terraform: "monitoring"
    auto_create: true
    drift_detect: enabled
    
  compliance:
    frameworks: ["soc2", "pci_dss", "gdpr", "hipaa"]
    evidence: true
    validation: true
    
  ai:
    anomaly: "enabled"
    predictive: "beta"
    auto_threshold: "enabled"
    incident_summary: "beta"
```

## Maturity Quiz

Score your monitoring.
