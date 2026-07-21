/**
 * Pair seed data. All prose here (angles, verdicts, FAQs) is original writing.
 * Every verdict is self-contained for answer-engine extraction: it names both
 * companies and tickers and the "as of" timeframe within the first ~80 words.
 * Every FAQ answer restates the entities so it reads correctly when quoted alone.
 *
 * `slug` is always alphabetical (see makePairSlug). `a`/`b` match the slug order.
 * `index` is the intended indexing decision; scripts/check-data.ts asserts it
 * equals shouldIndex(a, b, slug) so the flag can never silently drift from the gate.
 */
export interface Faq {
  q: string;
  a: string;
}

export interface Pair {
  slug: string;
  a: string; // alphabetically-first ticker
  b: string;
  index: boolean; // false = render but noindex (thin-pair demo)
  angle: string; // editorial angle used to keep each H1/verdict distinct
  verdictSummary: string; // 2-3 original, self-contained sentences
  faqs: Faq[]; // 4-5 pair-specific FAQs, original writing
}

export const PAIRS: Pair[] = [
  {
    slug: "aapl-vs-msft",
    a: "AAPL",
    b: "MSFT",
    index: true,
    angle: "the two most valuable companies on earth — hardware-plus-services against cloud-plus-software",
    verdictSummary:
      "As of Q2 2026, Apple (AAPL) and Microsoft (MSFT) are the two largest U.S. companies, each near a $3.3–3.4 trillion market cap. Microsoft carries the higher net margin (about 36% vs Apple's 24%) and faster revenue growth (roughly 14% vs 8% five-year CAGR), powered by Azure and AI. Apple trades at a marginally lower P/E and remains the stronger buyback machine. In short: Microsoft is the growth pick, Apple the steadier cash generator.",
    faqs: [
      {
        q: "Is Apple or Microsoft the bigger company in 2026?",
        a: "As of Q2 2026, Apple (AAPL) is marginally larger at roughly a $3.4 trillion market cap versus Microsoft's (MSFT) approximately $3.3 trillion, though the two regularly swap the top spot.",
      },
      {
        q: "Does Apple or Microsoft have higher profit margins?",
        a: "Microsoft (MSFT) has the higher net margin at about 36%, versus Apple's (AAPL) roughly 24%, reflecting Microsoft's software-heavy mix against Apple's hardware costs.",
      },
      {
        q: "Which stock has grown revenue faster, AAPL or MSFT?",
        a: "Microsoft (MSFT) has grown revenue faster, at roughly a 14% five-year CAGR versus Apple's (AAPL) 8%, largely on the strength of Azure cloud and AI services.",
      },
      {
        q: "Is Apple or Microsoft cheaper by P/E ratio?",
        a: "The two are close: Apple (AAPL) trades near a 35 P/E and Microsoft (MSFT) near 37 as of Q2 2026, so Apple is marginally cheaper on trailing earnings.",
      },
      {
        q: "Which pays a better dividend, Apple or Microsoft?",
        a: "Both yields are small, but Microsoft (MSFT) yields about 0.72% versus Apple's (AAPL) 0.45%, so Microsoft returns slightly more through dividends; both prioritise buybacks.",
      },
    ],
  },
  {
    slug: "amd-vs-nvda",
    a: "AMD",
    b: "NVDA",
    index: true,
    angle: "the AI-accelerator race — the challenger against the runaway leader",
    verdictSummary:
      "As of Q2 2026, NVIDIA (NVDA) dominates AI accelerators with roughly a 75% gross margin, a 55% net margin, and a market cap near $3.2 trillion, while AMD (AMD) is the distant number two at about $240 billion. AMD grows fast but earns far less per dollar of sales (about a 6% net margin). NVIDIA is the quality leader priced for it at a ~55 P/E; AMD is the higher-risk catch-up bet.",
    faqs: [
      {
        q: "Is NVIDIA more expensive than AMD by P/E?",
        a: "Yes. NVIDIA (NVDA) trades near a 55 P/E as of Q2 2026, above AMD's (AMD) roughly 45, so NVIDIA is the more richly valued of the two on trailing earnings.",
      },
      {
        q: "Which chipmaker is more profitable, AMD or NVIDIA?",
        a: "NVIDIA (NVDA) is far more profitable, with about a 55% net margin versus AMD's (AMD) roughly 6%, driven by NVIDIA's pricing power in data-center GPUs.",
      },
      {
        q: "Does AMD or NVIDIA have the bigger data-center business?",
        a: "NVIDIA (NVDA) has the far larger data-center franchise; its roughly $96 billion in TTM revenue dwarfs AMD's (AMD) approximately $25 billion, most of NVIDIA's coming from AI accelerators.",
      },
      {
        q: "Has AMD or NVIDIA delivered better 5-year returns?",
        a: "NVIDIA (NVDA) has crushed AMD over five years, returning roughly 2,600% versus AMD's (AMD) approximately 320% as of Q2 2026.",
      },
    ],
  },
  {
    slug: "googl-vs-meta",
    a: "GOOGL",
    b: "META",
    index: true,
    angle: "the two advertising superpowers — search-and-video against the social feed",
    verdictSummary:
      "As of Q2 2026, Alphabet (GOOGL) and Meta (META) are the two largest digital-advertising companies. Alphabet is bigger (about a $2.1 trillion market cap versus Meta's $1.5 trillion) and more diversified through Google Cloud, while Meta earns the higher gross margin (roughly 81% vs 58%) from its leaner ad model. Meta trades at a slightly higher P/E on faster recent growth. Alphabet is the diversified pick; Meta the higher-margin ad-pure-play.",
    faqs: [
      {
        q: "Is Alphabet or Meta the bigger advertising company?",
        a: "Alphabet (GOOGL) is bigger, at roughly a $2.1 trillion market cap and about $340 billion in revenue, versus Meta's (META) approximately $1.5 trillion and $156 billion as of Q2 2026.",
      },
      {
        q: "Which has higher margins, Alphabet or Meta?",
        a: "Meta (META) has the higher gross margin at about 81%, versus Alphabet's (GOOGL) roughly 58%, because Meta lacks Alphabet's lower-margin cloud and hardware lines.",
      },
      {
        q: "Is GOOGL or META cheaper on a P/E basis?",
        a: "Alphabet (GOOGL) is cheaper, trading near a 24 P/E versus Meta's (META) roughly 28 as of Q2 2026.",
      },
      {
        q: "Does Alphabet or Meta depend more on advertising?",
        a: "Meta (META) depends more on advertising, which is nearly all of its revenue, whereas Alphabet (GOOGL) also earns from Google Cloud and subscriptions, making Alphabet the more diversified of the two.",
      },
    ],
  },
  {
    slug: "amzn-vs-wmt",
    a: "AMZN",
    b: "WMT",
    index: true,
    angle: "the retail heavyweight bout — the everything store against the everyday-low-price giant",
    verdictSummary:
      "As of Q2 2026, Amazon (AMZN) and Walmart (WMT) are the two largest retailers by revenue, with Walmart's roughly $665 billion edging Amazon's approximately $620 billion. But the businesses differ: Amazon earns most of its profit from AWS cloud and trades at a growth multiple (about a 42 P/E), while Walmart is a thin-margin retailer (about 2.6% net margin) valued for stability and its dividend. Amazon is the growth-and-cloud pick; Walmart the defensive dividend play.",
    faqs: [
      {
        q: "Does Amazon or Walmart have more revenue?",
        a: "Walmart (WMT) has slightly more revenue, at roughly $665 billion TTM versus Amazon's (AMZN) approximately $620 billion as of Q2 2026, though Amazon earns far more profit per dollar via AWS.",
      },
      {
        q: "Why is Amazon's P/E so much higher than Walmart's?",
        a: "Amazon (AMZN) trades near a 42 P/E versus Walmart's (WMT) roughly 38 because investors price in Amazon's fast-growing, high-margin AWS cloud unit, whereas Walmart is a mature, thin-margin retailer.",
      },
      {
        q: "Which is a better dividend stock, Amazon or Walmart?",
        a: "Walmart (WMT) is the dividend choice, yielding about 1.1% with a long payout history, while Amazon (AMZN) pays no dividend as of Q2 2026.",
      },
      {
        q: "Is Amazon or Walmart more profitable?",
        a: "Amazon (AMZN) is more profitable overall, with about an 8% net margin versus Walmart's (WMT) roughly 2.6%, because Amazon's AWS earnings offset its low-margin retail operations.",
      },
    ],
  },
  {
    slug: "ko-vs-pep",
    a: "KO",
    b: "PEP",
    index: true,
    angle: "the cola wars, financially — a pure beverage margin machine against a food-and-drink hybrid",
    verdictSummary:
      "As of Q2 2026, Coca-Cola (KO) and PepsiCo (PEP) are the two blue-chip beverage dividend stocks. Coca-Cola is the leaner, higher-margin business (about a 23% net margin versus PepsiCo's 10%) because it is beverage-only, while PepsiCo adds Frito-Lay and Quaker snacks for a more diversified but lower-margin mix. PepsiCo yields more (about 3.5% vs 3.1%). Coca-Cola is the margin play; PepsiCo the diversified, slightly higher-yield option.",
    faqs: [
      {
        q: "Which is a better dividend stock, KO or PEP?",
        a: "PepsiCo (PEP) offers the higher yield at about 3.5%, versus Coca-Cola's (KO) roughly 3.1% as of Q2 2026; both are long-standing dividend growers, so PepsiCo edges it on current income.",
      },
      {
        q: "Is Coca-Cola or PepsiCo more profitable?",
        a: "Coca-Cola (KO) is more profitable by margin, at about a 23% net margin versus PepsiCo's (PEP) roughly 10%, because Coca-Cola sells only beverages while PepsiCo also runs a lower-margin snacks business.",
      },
      {
        q: "Does PepsiCo or Coca-Cola have more revenue?",
        a: "PepsiCo (PEP) has roughly double the revenue, about $92 billion TTM versus Coca-Cola's (KO) approximately $46 billion, because PepsiCo's totals include its Frito-Lay and Quaker food brands.",
      },
      {
        q: "Is KO or PEP cheaper by P/E?",
        a: "PepsiCo (PEP) is slightly cheaper, trading near a 22 P/E versus Coca-Cola's (KO) roughly 25 as of Q2 2026.",
      },
    ],
  },
  {
    slug: "ma-vs-v",
    a: "MA",
    b: "V",
    index: true,
    angle: "the payment-network duopoly — the number-two challenger against the scale leader",
    verdictSummary:
      "As of Q2 2026, Visa (V) and Mastercard (MA) form the payment-network duopoly, both earning fees on transaction volume without taking credit risk. Visa is larger (about a $560 billion market cap versus Mastercard's $470 billion) and posts a higher net margin (roughly 54% vs 46%), while Mastercard has grown revenue slightly faster (about 12% vs 10% five-year CAGR). Both are exceptional compounders; Visa is the scale-and-margin leader, Mastercard the marginally faster grower.",
    faqs: [
      {
        q: "Is Visa or Mastercard bigger?",
        a: "Visa (V) is bigger, at roughly a $560 billion market cap and about $36 billion in revenue, versus Mastercard's (MA) approximately $470 billion and $28 billion as of Q2 2026.",
      },
      {
        q: "Which is more profitable, Visa or Mastercard?",
        a: "Visa (V) has the higher net margin at about 54%, versus Mastercard's (MA) roughly 46%, though both are among the most profitable large companies in the market.",
      },
      {
        q: "Has Mastercard or Visa grown faster?",
        a: "Mastercard (MA) has grown revenue slightly faster, at roughly a 12% five-year CAGR versus Visa's (V) about 10%, helped by its value-added services push.",
      },
      {
        q: "Is V or MA cheaper by P/E?",
        a: "Visa (V) is cheaper, trading near a 30 P/E versus Mastercard's (MA) roughly 37 as of Q2 2026.",
      },
    ],
  },
  {
    slug: "cvx-vs-xom",
    a: "CVX",
    b: "XOM",
    index: true,
    angle: "the U.S. oil majors — a higher-yield operator against the larger, faster-growing integrated giant",
    verdictSummary:
      "As of Q2 2026, Exxon Mobil (XOM) and Chevron (CVX) are the two largest U.S. integrated oil majors. Exxon is the bigger company (about a $520 billion market cap versus Chevron's $280 billion) with higher revenue and slightly faster growth, while Chevron offers the higher dividend yield (roughly 4.2% vs 3.3%). Both are cyclical, cash-rich, and dividend-focused. Exxon is the scale-and-growth pick; Chevron the higher-yield income choice.",
    faqs: [
      {
        q: "Which oil stock pays a higher dividend, Exxon or Chevron?",
        a: "Chevron (CVX) pays the higher yield at about 4.2%, versus Exxon Mobil's (XOM) roughly 3.3% as of Q2 2026, making Chevron the stronger pick for dividend income.",
      },
      {
        q: "Is Exxon or Chevron the bigger oil company?",
        a: "Exxon Mobil (XOM) is bigger, at roughly a $520 billion market cap and about $340 billion in revenue, versus Chevron's (CVX) approximately $280 billion and $195 billion.",
      },
      {
        q: "Which is cheaper by P/E, XOM or CVX?",
        a: "Exxon Mobil (XOM) is marginally cheaper, near a 14 P/E versus Chevron's (CVX) roughly 15 as of Q2 2026, though both trade at typical low energy-sector multiples.",
      },
      {
        q: "Are Exxon and Chevron good inflation hedges?",
        a: "Both Exxon Mobil (XOM) and Chevron (CVX) tend to benefit when energy prices rise, but their earnings are cyclical and fall with oil prices, so neither is a guaranteed inflation hedge.",
      },
    ],
  },
  {
    slug: "bac-vs-jpm",
    a: "BAC",
    b: "JPM",
    index: true,
    angle: "the money-center banks — the steady retail franchise against the best-in-class universal bank",
    verdictSummary:
      "As of Q2 2026, JPMorgan Chase (JPM) and Bank of America (BAC) are two of the largest U.S. banks. JPMorgan is the larger and more profitable of the two (about a 30% net margin and $52 billion in net income versus Bank of America's 27% and $27 billion) and trades at a modest premium. Bank of America offers a slightly higher dividend yield. JPMorgan is the quality leader; Bank of America the lower-priced, rate-sensitive alternative.",
    faqs: [
      {
        q: "Is JPMorgan or Bank of America the bigger bank?",
        a: "JPMorgan Chase (JPM) is bigger, at roughly a $620 billion market cap versus Bank of America's (BAC) approximately $320 billion as of Q2 2026, and it earns nearly double the net income.",
      },
      {
        q: "Which bank stock is more profitable, JPM or BAC?",
        a: "JPMorgan Chase (JPM) is more profitable, with about a 30% net margin versus Bank of America's (BAC) roughly 27%, reflecting JPMorgan's stronger investment-banking and trading franchise.",
      },
      {
        q: "Does Bank of America or JPMorgan pay a higher dividend?",
        a: "Bank of America (BAC) yields slightly more, at about 2.5%, versus JPMorgan Chase (JPM) at roughly 2.3% as of Q2 2026.",
      },
      {
        q: "Which bank is more sensitive to interest rates?",
        a: "Bank of America (BAC) is generally seen as more rate-sensitive than JPMorgan Chase (JPM) because of its large low-cost deposit base and bond portfolio, so its net interest income swings more with rates.",
      },
    ],
  },
  {
    slug: "f-vs-tsla",
    a: "F",
    b: "TSLA",
    index: true,
    angle: "old Detroit against the EV disruptor — a value automaker against a growth-and-autonomy bet",
    verdictSummary:
      "As of Q2 2026, Tesla (TSLA) and Ford (F) sit at opposite ends of the auto market. Tesla is valued as a growth-and-AI company (about an $800 billion market cap and a ~70 P/E) despite lower revenue, while Ford is a classic value automaker (roughly a 7 P/E and a 5.5% dividend yield). Tesla has grown far faster; Ford earns steadier profit from trucks and pays a large dividend. Tesla is the growth bet; Ford the deep-value income stock.",
    faqs: [
      {
        q: "Why is Tesla worth so much more than Ford?",
        a: "Tesla (TSLA) is worth far more than Ford (F) — about $800 billion versus $44 billion as of Q2 2026 — because investors value Tesla on future growth in EVs, energy, and autonomy rather than on current auto profits.",
      },
      {
        q: "Does Ford or Tesla pay a dividend?",
        a: "Ford (F) pays a large dividend yielding about 5.5%, while Tesla (TSLA) pays no dividend as of Q2 2026, so Ford is the choice for income investors.",
      },
      {
        q: "Is Tesla or Ford more profitable per dollar of sales?",
        a: "The two are close on net margin — Tesla (TSLA) at about 8% versus Ford (F) at roughly 3% — but Tesla earns that on far less revenue, so Ford generates comparable total profit from a much larger sales base.",
      },
      {
        q: "Which stock is cheaper, F or TSLA?",
        a: "Ford (F) is dramatically cheaper by earnings, at roughly a 7 P/E versus Tesla's (TSLA) approximately 70 as of Q2 2026.",
      },
    ],
  },
  {
    slug: "jnj-vs-pfe",
    a: "JNJ",
    b: "PFE",
    index: true,
    angle: "big-pharma stability against a high-yield turnaround — quality against value",
    verdictSummary:
      "As of Q2 2026, Johnson & Johnson (JNJ) and Pfizer (PFE) are two large-cap pharma dividend stocks in very different shape. Johnson & Johnson is the steadier, more profitable business (about a 25% net margin) trading near a 15 P/E, while Pfizer is a higher-yield turnaround (about a 6.2% dividend) still replacing lost COVID-product revenue. Johnson & Johnson is the quality-and-stability pick; Pfizer the higher-risk, higher-yield value play.",
    faqs: [
      {
        q: "Which pharma stock has a higher dividend yield, JNJ or PFE?",
        a: "Pfizer (PFE) has the much higher yield at about 6.2%, versus Johnson & Johnson's (JNJ) roughly 3.1% as of Q2 2026, though Pfizer's higher yield reflects a weaker share price.",
      },
      {
        q: "Is Johnson & Johnson or Pfizer more profitable?",
        a: "Johnson & Johnson (JNJ) is more profitable, with about a 25% net margin versus Pfizer's (PFE) roughly 15%, and it has delivered steadier earnings in recent years.",
      },
      {
        q: "Why has Pfizer stock fallen relative to J&J?",
        a: "Pfizer (PFE) has fallen because its COVID-vaccine and antiviral revenue declined sharply, whereas Johnson & Johnson (JNJ) has more diversified, stable pharma and medical-device sales.",
      },
      {
        q: "Which is safer for a conservative investor, JNJ or PFE?",
        a: "Johnson & Johnson (JNJ) is generally considered the safer of the two, given its diversified revenue, higher margin, and long dividend-growth record, while Pfizer (PFE) carries more turnaround risk.",
      },
    ],
  },
  {
    slug: "dis-vs-nflx",
    a: "DIS",
    b: "NFLX",
    index: true,
    angle: "the streaming endgame — a diversified media empire against the pure-play streaming leader",
    verdictSummary:
      "As of Q2 2026, Netflix (NFLX) and Disney (DIS) represent two paths through streaming. Netflix is the profitable pure-play leader (about a 22% net margin, a ~42 P/E) with momentum from ads and paid sharing, while Disney blends profitable theme parks with a still-maturing streaming unit and earns a thinner overall margin (about 5.5%). Netflix is the streaming-momentum pick; Disney the diversified turnaround with park cash flow underneath.",
    faqs: [
      {
        q: "Is Netflix or Disney more profitable?",
        a: "Netflix (NFLX) is more profitable by margin, at about 22% net margin versus Disney's (DIS) roughly 5.5%, because Netflix is a focused streaming business while Disney carries heavier park and studio costs.",
      },
      {
        q: "Which streaming stock has grown faster, DIS or NFLX?",
        a: "Netflix (NFLX) has grown faster, at roughly a 15% five-year revenue CAGR versus Disney's (DIS) about 5%, and its stock has strongly outperformed Disney over five years.",
      },
      {
        q: "Does Disney or Netflix pay a dividend?",
        a: "Disney (DIS) pays a small dividend yielding about 0.9%, while Netflix (NFLX) pays no dividend as of Q2 2026, reinvesting instead in content.",
      },
      {
        q: "Is Netflix stock more expensive than Disney?",
        a: "By P/E they are close — Netflix (NFLX) near 42 and Disney (DIS) near 22 — but Netflix's much higher share price and margins mean the market values its earnings more richly than Disney's as of Q2 2026.",
      },
    ],
  },
  {
    slug: "amd-vs-intc",
    a: "AMD",
    b: "INTC",
    index: true,
    angle: "the x86 role reversal — the surging challenger against the turnaround incumbent",
    verdictSummary:
      "As of Q2 2026, AMD (AMD) and Intel (INTC) have swapped roles in x86 processors. AMD is now the larger company (about a $240 billion market cap versus Intel's $95 billion), growing revenue while Intel's has shrunk, though both earn thin net margins as AMD invests and Intel restructures. AMD is the momentum leader; Intel the deep-value foundry-turnaround bet that has lagged badly over five years.",
    faqs: [
      {
        q: "Is AMD or Intel the bigger company now?",
        a: "AMD (AMD) is now bigger, at roughly a $240 billion market cap versus Intel's (INTC) approximately $95 billion as of Q2 2026, a reversal from a decade ago when Intel dwarfed AMD.",
      },
      {
        q: "Which chip stock has performed better over 5 years, AMD or INTC?",
        a: "AMD (AMD) has vastly outperformed, returning roughly 320% over five years while Intel (INTC) has lost about 50% as of Q2 2026.",
      },
      {
        q: "Does Intel or AMD pay a dividend?",
        a: "Neither pays a meaningful dividend as of Q2 2026: Intel (INTC) suspended its dividend during its restructuring, and AMD (AMD) does not pay one.",
      },
      {
        q: "Why has Intel struggled against AMD?",
        a: "Intel (INTC) fell behind on manufacturing process technology and lost server and PC share to AMD (AMD), whose chips are built on more advanced external foundry processes.",
      },
    ],
  },
  {
    slug: "cost-vs-wmt",
    a: "COST",
    b: "WMT",
    index: true,
    angle: "the big-box champions — a membership-fee compounder against the everyday-low-price giant",
    verdictSummary:
      "As of Q2 2026, Costco (COST) and Walmart (WMT) are two dominant discount retailers with different engines. Costco earns much of its profit from recurring membership fees and trades at a premium (about a 52 P/E), while Walmart is a broader, thinner-margin retailer valued near a 38 P/E with a larger dividend. Both have compounded well. Costco is the membership-model quality pick; Walmart the larger, more diversified retailer with a bigger yield.",
    faqs: [
      {
        q: "Why does Costco trade at a higher P/E than Walmart?",
        a: "Costco (COST) trades near a 52 P/E versus Walmart's (WMT) roughly 38 because investors prize Costco's high-retention membership-fee model and consistent growth, which they reward with a premium multiple.",
      },
      {
        q: "Which retailer has more revenue, Costco or Walmart?",
        a: "Walmart (WMT) has far more revenue, roughly $665 billion TTM versus Costco's (COST) approximately $255 billion as of Q2 2026.",
      },
      {
        q: "Does Costco or Walmart pay a better dividend?",
        a: "Walmart (WMT) pays the higher regular yield at about 1.1%, versus Costco's (COST) roughly 0.5%, though Costco periodically pays large special dividends.",
      },
      {
        q: "Which has grown faster, COST or WMT?",
        a: "Costco (COST) has grown revenue faster, at roughly a 10% five-year CAGR versus Walmart's (WMT) about 5%, and its stock has outperformed over that period.",
      },
    ],
  },
  {
    slug: "mcd-vs-sbux",
    a: "MCD",
    b: "SBUX",
    index: true,
    angle: "the fast-food franchise machine against the coffee-retail turnaround",
    verdictSummary:
      "As of Q2 2026, McDonald's (MCD) and Starbucks (SBUX) are the two largest restaurant stocks. McDonald's is the far more profitable business (about a 32% net margin) thanks to its franchise-and-real-estate model, while Starbucks (about a 11% net margin) is mid-turnaround on U.S. throughput. McDonald's is the larger, steadier dividend compounder; Starbucks the smaller, higher-variance recovery story with a similar yield.",
    faqs: [
      {
        q: "Is McDonald's or Starbucks more profitable?",
        a: "McDonald's (MCD) is far more profitable, with about a 32% net margin versus Starbucks' (SBUX) roughly 11%, because McDonald's mostly collects franchise royalties and rent rather than running stores directly.",
      },
      {
        q: "Which pays a higher dividend, MCD or SBUX?",
        a: "The yields are close — Starbucks (SBUX) at about 2.5% and McDonald's (MCD) at roughly 2.3% as of Q2 2026 — so Starbucks edges it slightly on current income.",
      },
      {
        q: "Is McDonald's or Starbucks the bigger company?",
        a: "McDonald's (MCD) is bigger, at roughly a $205 billion market cap versus Starbucks' (SBUX) approximately $105 billion as of Q2 2026.",
      },
      {
        q: "Which restaurant stock is the safer pick?",
        a: "McDonald's (MCD) is generally seen as the steadier choice given its high margins and consistent franchise cash flow, while Starbucks (SBUX) carries more turnaround risk tied to U.S. and China sales.",
      },
    ],
  },
  {
    slug: "hd-vs-low",
    a: "HD",
    b: "LOW",
    index: true,
    angle: "the home-improvement duopoly — the pro-focused leader against the DIY-weighted number two",
    verdictSummary:
      "As of Q2 2026, Home Depot (HD) and Lowe's (LOW) split the U.S. home-improvement market. Home Depot is larger (about a $400 billion market cap versus Lowe's $145 billion) and skews toward professional contractors with slightly higher margins, while Lowe's leans more on DIY customers and trades at a lower P/E with a smaller dividend yield. Home Depot is the scale-and-pro leader; Lowe's the somewhat cheaper number-two catching up on execution.",
    faqs: [
      {
        q: "Is Home Depot or Lowe's the bigger company?",
        a: "Home Depot (HD) is bigger, at roughly a $400 billion market cap and about $152 billion in revenue, versus Lowe's (LOW) approximately $145 billion and $85 billion as of Q2 2026.",
      },
      {
        q: "Which is more profitable, HD or LOW?",
        a: "Home Depot (HD) is slightly more profitable, with about a 9.9% net margin versus Lowe's (LOW) roughly 9%, helped by its larger professional-contractor business.",
      },
      {
        q: "Does Home Depot or Lowe's pay a higher dividend?",
        a: "Home Depot (HD) pays the higher yield at about 2.3%, versus Lowe's (LOW) roughly 1.8% as of Q2 2026.",
      },
      {
        q: "Is Lowe's cheaper than Home Depot?",
        a: "Yes, Lowe's (LOW) is cheaper by earnings, trading near a 22 P/E versus Home Depot's (HD) roughly 26 as of Q2 2026.",
      },
    ],
  },
  {
    slug: "cvs-vs-unh",
    a: "CVS",
    b: "UNH",
    index: true,
    angle: "managed care against the integrated pharmacy — the quality leader versus the high-yield value play",
    verdictSummary:
      "As of Q2 2026, UnitedHealth (UNH) and CVS Health (CVS) are two healthcare giants under pressure from medical costs. UnitedHealth is the far larger and more profitable company (about a $500 billion market cap and a 5.5% net margin) valued near a 20 P/E, while CVS is a thin-margin (about 1.2%), high-yield value stock trading near a 10 P/E after a rough stretch. UnitedHealth is the quality pick; CVS the deep-value, higher-yield contrarian bet.",
    faqs: [
      {
        q: "Is UnitedHealth or CVS more profitable?",
        a: "UnitedHealth (UNH) is much more profitable, with about a 5.5% net margin versus CVS Health's (CVS) roughly 1.2%, and it earns far more total profit despite CVS having comparable revenue.",
      },
      {
        q: "Which has the higher dividend yield, CVS or UNH?",
        a: "CVS Health (CVS) has the higher yield at about 4.0%, versus UnitedHealth's (UNH) roughly 1.5% as of Q2 2026, reflecting CVS's lower share price.",
      },
      {
        q: "Why is CVS cheaper than UnitedHealth by P/E?",
        a: "CVS Health (CVS) trades near a 10 P/E versus UnitedHealth's (UNH) roughly 20 because CVS's margins are thinner and its earnings outlook is seen as riskier than UnitedHealth's.",
      },
      {
        q: "Which healthcare stock is higher quality, UNH or CVS?",
        a: "UnitedHealth (UNH) is generally regarded as the higher-quality business, with stronger margins and its Optum services arm, while CVS Health (CVS) is more of a turnaround-and-value situation.",
      },
    ],
  },
  {
    slug: "ba-vs-lmt",
    a: "BA",
    b: "LMT",
    index: true,
    angle: "aerospace and defense — a commercial-jet recovery story against a steady defense-backlog compounder",
    verdictSummary:
      "As of Q2 2026, Boeing (BA) and Lockheed Martin (LMT) are two aerospace-and-defense leaders with opposite profiles. Lockheed Martin is the steady, profitable defense contractor (about a 9.4% net margin, a 2.7% dividend) backed by a long government backlog, while Boeing is a commercial-jet recovery story with thin margins and no dividend after its production troubles. Lockheed Martin is the stability-and-income pick; Boeing the higher-risk turnaround.",
    faqs: [
      {
        q: "Is Boeing or Lockheed Martin more profitable?",
        a: "Lockheed Martin (LMT) is far more profitable, with about a 9.4% net margin versus Boeing's (BA) roughly 1.9%, because Lockheed's defense contracts are steadier than Boeing's troubled commercial-jet business.",
      },
      {
        q: "Does Boeing or Lockheed Martin pay a dividend?",
        a: "Lockheed Martin (LMT) pays a dividend yielding about 2.7%, while Boeing (BA) suspended its dividend during its recovery and pays none as of Q2 2026.",
      },
      {
        q: "Which aerospace stock is safer, BA or LMT?",
        a: "Lockheed Martin (LMT) is generally considered safer, given its government-funded backlog and steady margins, whereas Boeing (BA) carries execution and cash-flow risk tied to jet production.",
      },
      {
        q: "Why has Boeing stock underperformed Lockheed Martin?",
        a: "Boeing (BA) has underperformed — down roughly 45% over five years versus a gain for Lockheed Martin (LMT) — because of aircraft safety, certification, and production-quality problems that hurt its cash flow.",
      },
    ],
  },
  {
    slug: "t-vs-vz",
    a: "T",
    b: "VZ",
    index: true,
    angle: "the telecom high-yielders — two debt-heavy carriers competing on dividend and network",
    verdictSummary:
      "As of Q2 2026, AT&T (T) and Verizon (VZ) are the two large U.S. wireless carriers, both prized mainly for high dividends. Verizon offers the bigger yield (about 6.4% versus AT&T's 5.0%) and slightly higher margin, while AT&T has recently outperformed on its debt-reduction and fiber story. Both carry heavy debt and grow slowly. Verizon is the higher-yield income pick; AT&T the modest-growth, deleveraging turnaround.",
    faqs: [
      {
        q: "Which pays a higher dividend, AT&T or Verizon?",
        a: "Verizon (VZ) pays the higher yield at about 6.4%, versus AT&T's (T) roughly 5.0% as of Q2 2026, making Verizon the stronger pick for dividend income.",
      },
      {
        q: "Is AT&T or Verizon more profitable?",
        a: "The two are similar — Verizon (VZ) at about a 9.3% net margin and AT&T (T) at roughly 9.8% — so neither has a decisive profitability edge as of Q2 2026.",
      },
      {
        q: "Which telecom stock has performed better recently, T or VZ?",
        a: "AT&T (T) has outperformed Verizon (VZ) over the past year, up about 30% versus roughly 10%, as investors rewarded its debt reduction and fiber growth.",
      },
      {
        q: "Are AT&T and Verizon safe dividend stocks?",
        a: "Both AT&T (T) and Verizon (VZ) generate steady cash flow that covers their dividends, but each carries substantial debt, so their high yields come with balance-sheet risk rather than being risk-free.",
      },
    ],
  },
  {
    slug: "lulu-vs-nke",
    a: "LULU",
    b: "NKE",
    index: true,
    angle: "athleisure showdown — a high-margin premium upstart against the scale leader in a slump",
    verdictSummary:
      "As of Q2 2026, Nike (NKE) and Lululemon (LULU) are both working through demand slowdowns. Nike is far larger (about a $110 billion market cap versus Lululemon's $40 billion) but lower-margin (about a 10% net margin), while Lululemon earns a premium margin (about 16%) and has grown faster historically. Both stocks have fallen over the past year. Nike is the scale-and-turnaround pick; Lululemon the higher-margin, higher-growth premium brand.",
    faqs: [
      {
        q: "Is Nike or Lululemon more profitable?",
        a: "Lululemon (LULU) has the higher net margin at about 16%, versus Nike's (NKE) roughly 10%, thanks to Lululemon's premium pricing, though Nike earns far more total profit on its larger sales base.",
      },
      {
        q: "Which is the bigger company, NKE or LULU?",
        a: "Nike (NKE) is much bigger, at roughly a $110 billion market cap and about $49 billion in revenue, versus Lululemon's (LULU) approximately $40 billion and $10.5 billion as of Q2 2026.",
      },
      {
        q: "Does Nike or Lululemon pay a dividend?",
        a: "Nike (NKE) pays a dividend yielding about 2.0%, while Lululemon (LULU) pays no dividend as of Q2 2026, reinvesting in growth instead.",
      },
      {
        q: "Which has grown faster, Nike or Lululemon?",
        a: "Lululemon (LULU) has grown revenue faster, at roughly a 19% five-year CAGR versus Nike's (NKE) about 4%, although both have seen growth slow recently.",
      },
    ],
  },
  {
    slug: "pg-vs-ul",
    a: "PG",
    b: "UL",
    index: true,
    angle: "consumer-staples giants — a high-margin dividend aristocrat against a higher-yield global value play",
    verdictSummary:
      "As of Q2 2026, Procter & Gamble (PG) and Unilever (UL) are two consumer-staples leaders. Procter & Gamble is the more profitable business (about an 18.5% net margin) trading at a premium (roughly a 27 P/E), while Unilever offers a higher dividend yield (about 3.2% versus 2.4%) and more emerging-markets exposure at a lower multiple. Procter & Gamble is the quality-and-consistency pick; Unilever the higher-yield, cheaper global value option.",
    faqs: [
      {
        q: "Is Procter & Gamble or Unilever more profitable?",
        a: "Procter & Gamble (PG) is more profitable, with about an 18.5% net margin versus Unilever's (UL) roughly 11%, reflecting P&G's premium brands and pricing power.",
      },
      {
        q: "Which has the higher dividend yield, PG or UL?",
        a: "Unilever (UL) has the higher yield at about 3.2%, versus Procter & Gamble's (PG) roughly 2.4% as of Q2 2026.",
      },
      {
        q: "Is Unilever cheaper than Procter & Gamble?",
        a: "Yes, Unilever (UL) trades near a 20 P/E versus Procter & Gamble's (PG) roughly 27 as of Q2 2026, so Unilever is the cheaper of the two on earnings.",
      },
      {
        q: "Which staples stock has more emerging-markets exposure?",
        a: "Unilever (UL) has greater emerging-markets exposure than Procter & Gamble (PG), which brings faster potential growth but also more currency and demand volatility.",
      },
    ],
  },
  {
    slug: "aapl-vs-googl",
    a: "AAPL",
    b: "GOOGL",
    index: true,
    angle: "the mobile-platform rivals — a hardware-and-services giant against the search-and-cloud leader",
    verdictSummary:
      "As of Q2 2026, Apple (AAPL) and Alphabet (GOOGL) are cross-sector rivals whose mobile ecosystems compete directly. Apple is the larger company (about a $3.4 trillion market cap versus Alphabet's $2.1 trillion) and the stronger buyback machine, while Alphabet is cheaper (about a 24 P/E versus 35) and has grown revenue faster. Apple is the premium hardware-and-services pick; Alphabet the lower-multiple, faster-growing advertising-and-cloud play.",
    faqs: [
      {
        q: "Is Apple or Alphabet the bigger company?",
        a: "Apple (AAPL) is bigger, at roughly a $3.4 trillion market cap versus Alphabet's (GOOGL) approximately $2.1 trillion as of Q2 2026.",
      },
      {
        q: "Which is cheaper by P/E, AAPL or GOOGL?",
        a: "Alphabet (GOOGL) is considerably cheaper, trading near a 24 P/E versus Apple's (AAPL) roughly 35 as of Q2 2026.",
      },
      {
        q: "Has Apple or Alphabet grown revenue faster?",
        a: "Alphabet (GOOGL) has grown revenue faster, at roughly a 16% five-year CAGR versus Apple's (AAPL) about 8%, helped by Search, YouTube, and Google Cloud.",
      },
      {
        q: "Do Apple and Alphabet compete directly?",
        a: "Yes, Apple (AAPL) and Alphabet (GOOGL) compete directly in mobile platforms — iOS versus Android — and in areas like maps, browsers, and AI assistants, even though they sit in different sectors.",
      },
    ],
  },
  {
    slug: "cvbf-vs-myrg",
    a: "CVBF",
    b: "MYRG",
    index: false,
    angle: "a deliberately thin pair — an unrelated regional bank and niche industrial with no real comparison demand",
    verdictSummary:
      "As of Q2 2026, CVB Financial (CVBF), a California regional bank, and MYR Group (MYRG), a specialty electrical-construction contractor, are unrelated small-to-mid-cap companies in different sectors. There is no meaningful investor rivalry or search demand for comparing them. This page exists only to demonstrate the curation gate: it renders normally but is deliberately marked noindex and excluded from the sitemap.",
    faqs: [
      {
        q: "Why is the CVBF vs MYRG comparison not indexed?",
        a: "The CVB Financial (CVBF) versus MYR Group (MYRG) page is deliberately set to noindex because the pair fails the curation gate — the two are in different sectors, are both under $10 billion, and have no real comparison search demand.",
      },
      {
        q: "Are CVB Financial and MYR Group competitors?",
        a: "No, CVB Financial (CVBF) is a regional bank and MYR Group (MYRG) is an electrical-construction contractor; they operate in unrelated industries and do not compete.",
      },
    ],
  },
];

const BY_SLUG: Map<string, Pair> = new Map(PAIRS.map((p) => [p.slug, p]));

/** All pairs intended for indexing (excludes the thin demo pair). */
export const INDEXABLE_PAIRS: Pair[] = PAIRS.filter((p) => p.index);

/** Pairs surfaced on the homepage. Single source of truth (home + check:links). */
export const FEATURED_SLUGS = ["aapl-vs-msft", "amd-vs-nvda", "ko-vs-pep", "f-vs-tsla"] as const;

/** Look up a pair by its canonical slug. */
export function getPair(slug: string): Pair | undefined {
  return BY_SLUG.get(slug);
}
