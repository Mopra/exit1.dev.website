// Domain validation and blacklist utilities

// Blacklisted domains from blacklisted-domains-v2.md
const BLACKLISTED_DOMAINS = [
  // Major platforms (search & ecosystems)
  'googleapis.com', 'gstatic.com', 'googleusercontent.com', 'googletagmanager.com', 'google-analytics.com', 'doubleclick.net', 'googlesyndication.com', 'googleadservices.com',
  'microsoft.com', 'office.com', 'outlook.com', 'live.com', 'msn.com', 'skype.com', 'sharepoint.com', 'teams.microsoft.com', 'onedrive.live.com',
  'apple.com', 'icloud.com',
  'primevideo.com',
  
  // Social media & communities
  'facebook.com', 'fb.com', 'fbcdn.net', 'fbsbx.com', 'messenger.com', 'instagram.com', 'cdninstagram.com', 'threads.net',
  'twitter.com', 'x.com', 't.co', 'twimg.com',
  'linkedin.com', 'licdn.com',
  'youtube.com', 'youtu.be', 'ytimg.com',
  'tiktok.com', 'tiktokcdn.com', 'tiktokv.com',
  'snapchat.com',
  'pinterest.com', 'pinimg.com',
  'reddit.com', 'redd.it', 'redditmedia.com',
  'discord.com', 'discord.gg', 'discordapp.com', 'discordapp.net', 'discordcdn.com',
  'telegram.org', 't.me', 'telegra.ph',
  'whatsapp.com', 'signal.org', 'viber.com', 'line.me', 'wechat.com', 'qq.com', 'kakao.com', 'naver.com', 'daum.net', 'weibo.com',
  
  // Streaming & entertainment
  'netflix.com', 'hulu.com', 'disneyplus.com', 'max.com', 'paramountplus.com', 'peacocktv.com', 'crunchyroll.com', 'funimation.com', 'spotify.com',
  
  // Communication & productivity
  'slack.com', 'zoom.us', 'gmail.com', 'yahoo.com', 'hotmail.com', 'protonmail.com', 'tutanota.com',
  
  // Search engines
  'bing.com', 'duckduckgo.com', 'baidu.com', 'yandex.com', 'seznam.cz', 'ask.com',
  
  // E-commerce & shopping
  'alibaba.com', 'aliexpress.com', 'taobao.com', 'tmall.com', 'jd.com', 'ebay.com', 'etsy.com', 'walmart.com', 'target.com', 'bestbuy.com', 'costco.com', 'rakuten.co.jp', 'shein.com', 'temu.com',
  
  // Payments & finance
  'paypal.com', 'stripe.com', 'squareup.com', 'cash.app', 'venmo.com', 'zellepay.com', 'wise.com', 'revolut.com', 'payoneer.com', 'coinbase.com', 'binance.com', 'kraken.com',
  
  // Site builders, hosts & dev sandboxes
  'shopify.com', 'myshopify.com', 'wix.com', 'squarespace.com', 'webflow.com', 'wordpress.com', 'blogger.com', 'weebly.com', 'godaddy.com', 'namecheap.com', 'bluehost.com', 'hostgator.com', 'dreamhost.com', 'vercel.app', 'netlify.app', 'pages.dev', 'github.io', 'readthedocs.io', 'cloudfront.net', 'azurewebsites.net', 'herokuapp.com', 'firebaseapp.com', 'replit.com', 'glitch.me', 'codepen.io', 'jsfiddle.net', 'codesandbox.io',
  
  // Developer hubs & Q&A
  'github.com', 'gitlab.com', 'bitbucket.org', 'stackoverflow.com', 'stackexchange.com', 'dev.to', 'hashnode.com', 'medium.com',
  
  // Cloud & storage
  'dropbox.com', 'drive.google.com', 'onedrive.live.com', 'box.com', 'mega.nz', 'pcloud.com', 'sync.com',
  
  // Design & creative
  'figma.com', 'canva.com', 'behance.net', 'dribbble.com', 'artstation.com', 'deviantart.com', 'flickr.com', '500px.com',
  
  // Documentation & knowledge
  'wikipedia.org', 'wikimedia.org', 'wikibooks.org', 'wikiversity.org', 'wikiquote.org', 'wiktionary.org', 'wikisource.org', 'wikinews.org', 'wikidata.org', 'wikivoyage.org', 'wikimediafoundation.org',
  
  // News & media
  'bbc.com', 'bbc.co.uk', 'reuters.com', 'ap.org', 'bloomberg.com', 'cnn.com', 'cnbc.com', 'foxnews.com', 'msnbc.com', 'npr.org', 'pbs.org', 'aljazeera.com', 'dw.com', 'france24.com', 'euronews.com',
  
  // Japan (popular portals & media)
  'yahoo.co.jp', 'rakuten.co.jp', 'mercari.com', 'paypay.ne.jp', 'cookpad.com', 'hatena.ne.jp', 'fc2.com', 'livedoor.com', 'goo.ne.jp', 'biglobe.ne.jp', 'so-net.ne.jp', 'ocn.ne.jp', 'nifty.com', 'asahi.com', 'mainichi.jp', 'yomiuri.co.jp', 'sankei.com', 'nikkei.com', 'jiji.com', 'kyodo.co.jp', 'nhk.or.jp', 'fujitv.co.jp', 'tbs.co.jp', 'ntv.co.jp', 'tv-asahi.co.jp', 'tv-tokyo.co.jp', 'tokyo-mx.net',
  
  // Local & development
  'exit1.dev', 'localhost', '127.0.0.1', '0.0.0.0', '::1', 'example.com'
]

// PSL patterns for major platforms (Public Suffix List aware)
const PSL_PATTERNS = [
  // Google domains across all ccTLDs
  /^google\.(com|co\.uk|de|fr|it|es|ca|com\.au|com\.br|co\.jp|co\.in|ru|cn|nl|se|no|dk|fi|pl|cz|hu|ro|bg|hr|si|sk|lt|lv|ee|pt|gr|cy|mt|lu|be|at|ch|li|mc|sm|va|ad|gi|je|gg|im|ax|fo|gl|is|sj|bv|nf|aq|tf|hm|gs|pf|nc|wf|yt|pm|bl|mf|gp|mq|re)$/,
  // Amazon domains across all ccTLDs
  /^amazon\.(com|co\.uk|de|fr|it|es|ca|com\.au|com\.br|co\.jp|co\.in|nl|se|no|dk|fi|pl|cz|hu|ro|bg|hr|si|sk|lt|lv|ee|pt|gr|cy|mt|lu|be|at|ch|li|mc|sm|va|ad|gi|je|gg|im|ax|fo|gl|is|sj|bv|nf|aq|tf|hm|gs|pf|nc|wf|yt|pm|bl|mf|gp|mq|re)$/
]

// Free domain TLDs that should be blocked (REVIEW tier)
const BLOCKED_TLDS = [
  'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 'online', 'site', 'website', 'space', 'tech', 'digital', 'icu', 'click', 'cam'
]

export interface DomainValidationResult {
  isValid: boolean
  error?: string
  domain: string
}

export function validateDomain(url: string): DomainValidationResult {
  // Clean the URL to extract domain
  let cleanUrl = url.trim().toLowerCase()
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`
  }

  try {
    const urlObj = new URL(cleanUrl)
    const domain = urlObj.hostname.replace('www.', '')
    
    // Check if domain is blacklisted
    if (BLACKLISTED_DOMAINS.includes(domain)) {
      return {
        isValid: false,
        error: `Sorry, we don't monitor major platforms like ${domain}.`,
        domain
      }
    }
    
    // Check PSL patterns
    for (const pattern of PSL_PATTERNS) {
      if (pattern.test(domain)) {
        return {
          isValid: false,
          error: `Sorry, we don't monitor major platforms like ${domain}.`,
          domain
        }
      }
    }
    
    // Check for blocked TLDs
    const tld = domain.split('.').pop()
    if (tld && BLOCKED_TLDS.includes(tld)) {
      return {
        isValid: false,
        error: `Sorry, we don't support free domain providers like .${tld}.`,
        domain
      }
    }
    
    return {
      isValid: true,
      domain
    }
  } catch {
    return {
      isValid: false,
      error: 'Please enter a valid website URL.',
      domain: url.trim()
    }
  }
}

export function extractDomain(url: string): string {
  let cleanUrl = url.trim().toLowerCase()
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`
  }

  try {
    const urlObj = new URL(cleanUrl)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url.trim()
  }
}
