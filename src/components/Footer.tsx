import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <>
    <footer className="footer">
      <div className="wrap">
        <div className="f-top">
          <div className="f-brand">
            <Link className="brand" href="/" aria-label="Coincashy home">
              <Image className="brand-logo logo-on-dark" src="/media/logo-on-dark.png" alt="Coincashy"  height={100} width={100} />
              <Image className="brand-logo logo-on-paper" src="/media/logo-on-paper.png" alt=""  height={100} width={100} />
            </Link>
            <p className="f-desc">Crypto, stablecoins and fiat rails for people and businesses. Buy, sell and spend, or accept, convert and settle at scale.</p>
            <div className="f-social">
              <a href="https://x.com/coincashy" target="_blank" rel="noopener" aria-label="Coincashy on X"><svg className="bm" aria-hidden="true"><use href="#b-x" /></svg></a>
              <a href="https://t.me/coincashy" target="_blank" rel="noopener" aria-label="Coincashy on Telegram"><svg className="bm" aria-hidden="true"><use href="#b-telegram" /></svg></a>
              <a href="https://www.facebook.com/coincashy" target="_blank" rel="noopener" aria-label="Coincashy on Facebook"><svg className="bm" aria-hidden="true"><use href="#b-facebook" /></svg></a>
              <a href="https://www.instagram.com/coin.cashy/" target="_blank" rel="noopener" aria-label="Coincashy on Instagram"><svg className="bm" aria-hidden="true"><use href="#b-instagram" /></svg></a>
              <a href="https://www.linkedin.com/company/coincashy/" target="_blank" rel="noopener" aria-label="Coincashy on LinkedIn"><svg className="bm" aria-hidden="true"><use href="#b-linkedin" /></svg></a>
              <a href="mailto:support@coincashy.io" aria-label="Email Coincashy"><svg className="ic" aria-hidden="true"><use href="#i-mail" /></svg></a>
            </div>
          </div>
          <div className="f-cols">
            <div className="f-col"><h4>Products</h4><Link href="/buy-crypto">Buy crypto</Link><Link href="/sell-crypto">Sell crypto</Link><Link href="/convert-crypto">Convert crypto</Link><Link href="/cards">Crypto card</Link><Link href="/processing">Crypto processing</Link><Link href="/otc">OTC &amp; liquidity</Link><Link href="/ramp">On/off-ramp</Link><Link href="/vibans">vIBANs</Link><Link href="/wallets">Wallet as a Service</Link><Link href="/cards#corporate">Corporate cards</Link><Link href="/settlement">Stablecoin settlement</Link></div>
            <div className="f-col"><h4>Solutions</h4><Link href="/personal">Individuals</Link><Link href="/processing">Merchants &amp; PSPs</Link><Link href="/otc">OTC desks &amp; brokers</Link><Link href="/business">Fintechs &amp; platforms</Link><Link href="/settlement">Treasury &amp; accounts</Link></div>
            <div className="f-col"><h4>Developers</h4><Link href="/developers#00">API overview</Link><Link href="/developers#04">Payments API</Link><Link href="/developers#07">Wallet API</Link><Link href="/developers#05">Quotes API</Link><Link href="/developers#06">Webhooks</Link></div>
            <div className="f-col"><h4>Resources</h4><Link href="/personal#how">How it works</Link><Link href="/blog">Blog</Link><Link href="/help">Help center</Link><Link href="/fees">Fees &amp; limits</Link><Link href="/status">System status</Link><Link href="/help">FAQ</Link></div>
            <div className="f-col"><h4>Company</h4><Link href="/about">About Coincashy</Link><Link href="/compliance">Compliance</Link><Link href="/careers">Careers</Link><Link href="/contact">Contact</Link><Link href="/auth/login">Log in</Link><Link href="/auth/signup">Get started</Link></div>
          </div>
        </div>
        <div className="f-mid">
          <div className="f-contact"><span>Support</span><code>support@coincashy.io</code></div>
          <ul className="f-links">
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/cookies">Cookie Policy</Link></li>
            <li><Link href="/aml">AML Policy</Link></li>
            <li><Link href="/complaints">Complaints &amp; disclosures</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
        <div className="f-legal">
          <p>© 2026 Coincashy. All rights reserved. Products and availability are subject to jurisdiction, onboarding and partner approval.</p>
          <p>Crypto-assets are volatile and their value can go down as well as up. Card, account and vIBAN services are partner-enabled and subject to eligibility. Visa, Mastercard, Apple Pay, Google Pay, SEPA, Bitcoin, Ethereum and Tether are marks of their respective owners, shown as accepted methods.</p>
          <p><strong>Disclaimer</strong><br />Coincashy Sp. z o.o. only provides services to customers resident in the UK who fall within an exemption available under the UK financial promotion regime (Investment professionals, High net worth companies, unincorporated associations etc., Certified sophisticated investors, Communication to overseas recipients, etc).</p>
        </div>
      </div>
    </footer>
    <dialog className="mail-dialog" id="mail-dialog" aria-labelledby="md-title">
      <div className="md-inner">
        <div className="md-top"><h2 id="md-title">Your message is ready</h2><button className="md-x" type="button" id="md-close" aria-label="Close"><svg className="ic" aria-hidden="true"><use href="#i-x" /></svg></button></div>
        <p className="md-note">Nothing has been sent yet. Send it from your email app, or copy it into any email.</p>
        <div className="md-fields">
          <div className="md-field"><span>To</span><code>support@coincashy.io</code></div>
          <div className="md-field"><span>Subject</span><code id="md-subject" /></div>
          <div className="md-field"><span>Message</span><pre className="md-body" id="md-body" /></div>
        </div>
        <div className="md-actions">
          <button className="btn btn-solid btn-sm" type="button" id="md-copy"><svg className="ic" aria-hidden="true"><use href="#i-copy" /></svg>Copy message</button>
          <a className="btn btn-line btn-sm" id="md-open" href="mailto:support@coincashy.io"><svg className="ic" aria-hidden="true"><use href="#i-mail" /></svg>Open email app</a>
        </div>
      </div>
    </dialog>
    <div className="toast" id="toast" role="status" aria-live="polite" />
    </>
  );
}
