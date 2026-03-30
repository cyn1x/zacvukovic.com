---
title: The Day a SoundCloud Rapper Ruined my Tidal Experience
author: Zac Vukovic
template: post.html
description: A technical analysis of streaming service metadata structure.
category: technical
---

<!-- Abbreviations -->
*[DDEX]: Digital Data Exchange
*[ISNI]: International Standard Name Identifier
*[ISRC]: International Standard Recording Code
*[ISWC]: International Standard Musical Work Code 
*[IPN]: Interested Parties Information
*[ABC]: Australian Broadcasting Corporation
*[TL;DR]: too long; didn't read
<!-- Abbreviations -->

<div class="callout--info">
    <p><strong>TL;DR</strong></p>
    <p>
        A real-world example showing how fundamental database design constraints can negatively impact product user experience.
    </p>
    <p><strong>Key Points</strong></p>
    <ul>
        <li>
            Multiple artist profiles share the same unique identifier, uncovered via API reverse engineering.
        </li>
        <li>
            Fixing the issue is straightforward in concept, but complex in implementation at scale.
        </li>
        <li>
            Propose a three-tier resolution framework: identity, remediation, and governance.
        </li>
        <li>
            Data complexity and scale challenges accelerate even faster in the post-AI landscape.
        </li>
    </ul>
</div>

[Skip to content](#Problem)

I was at the gym listening to metal when suddenly, an autotuned SoundCloud rapper started screaming in my ear about the usual clichés. My immediate reaction was, "what the f\*\*\* is this s\*\*\*?"

I freaked out thinking I somehow accidentally polluted my playlist, or I had been navigated to some algorithmic "popular music" feed after an album ended. Unexpectedly, it turned out to be a subtle, but very concerning flaw under the surface involving artist metadata, that fundamentally affected my onboarding experience as a new user to the platform.

Naturally, I went down a rabbit hole trying to figure out what happened, and more importantly, *why*. When I noticed what was actually going on, I was confused as to why a well-known music streaming service that prides itself on quality by offering higher bitrates, better royalties, and a better listening experience, could ship a metadata bug capable of merging unrelated artists into a single identity.

## Introduction

I first moved over to Tidal after an album from an artist I listen to was removed from Spotify, with no official explanation. On top of that, some of the remaining albums even lost their cover art. There seem to be two main theories on why this happened: record label disputes, or politically motivated censorship efforts, the latter being mostly amplified in some online communities.

<figure class="figure--narrow">
    <picture>
        <source type="image/webp" media="(width < 800px)" 
            srcset="/img/content/blog/001/PXL_20250802_032246801_(512).webp">
        <source type="image/webp" media="(width >= 800px)"
            srcset="/img/content/blog/001/PXL_20250802_032246801.webp">
        <source type="image/jpeg" media="(width < 800px)"
            srcset="/img/content/blog/001/PXL_20250802_032246801_(512).jpg">
        <source type="image/jpeg" media="(width >= 800px)"
            srcset="/img/content/blog/001/PXL_20250802_032246801.jpg">
        <img src="/img/content/blog/001/PXL_20250802_032246801.jpg" alt="Snowfall in Armidale on 2nd August, 2025.">
    </picture>
    <figcaption>Snowfall of this magnitude calls for some black metal. It's definitely seasonal per se, akin to how punk rock cleanses the air of boring, tired old political slogans when it's time to line up at a polling booth to get my name ticked off.</figcaption>
</figure>

Physical media certainly is a viable option to opt out of having your listening habits dictated by big tech. I have somewhere between 150 to 200 CDs that I've ripped to local storage for self-hosted streaming. That said, paid streaming services have completely changed the way I discover new music.

I can't stand podcasts, and only really listen to the odd episode with intent. Most of my passive audio listening time is dominated by music; either the albums I've spun countless times, or whatever the curated feeds conjure algorithmically. This method has become increasingly valuable since leaving my hometown over a decade ago, and not having the option of hanging out in record stores and ask for recommendations. Without curation feeds, I would have likely never discovered my guilty pleasure of power metal beyond the legendary band, Blind Guardian.

Anyway, I saw Tidal had more expensive subscription tiers than Spotify, thanks to offering higher quality bitrates above 320 kbps and more royalties paid to artists. So I thought, *why not*?

## Premise

That listening incident at the gym almost ruined my training session. It led me to log my first support request with Tidal back in March 2023. Credit where it's due, the Tidal Support Team were very communicative throughout the entire mediation process with the Content Team, consistently responding quickly to complaints about questionable feature rollouts. 

One example was the "Live Sessions" feature which introduced a social aspect to the app, promoting what other users are listening to. That pissed me off, because it opens the door to some "influenzer" wanting to push official Top 40 playlists and grift unsuspecting listeners with "content" they don't need. There's already enough noise on the internet as it is. I don't want a "social" feature in my music streaming application any more than I need Wi-Fi functionality for my household appliances. These days, that argument even extends to embedding AI agents in them. Thankfully, Tidal added an option to disable that "social" feature for people who aren't chronically online.

<figure class="figure--narrow">
    <picture>
        <source type="image/webp" media="(width < 800px)" 
            srcset="/img/content/blog/001/2026-03-15_18_02_18-_(Small).webp">
        <source type="image/webp" media="(width >= 800px)"
            srcset="/img/content/blog/001/2026-03-15_18_02_18-.webp">
        <source type="image/png" media="(width < 800px)"
            srcset="/img/content/blog/001/2026-03-15_18_02_18-_(Small).png">
        <source type="image/png" media="(width >= 800px)"
            srcset="/img/content/blog/001/2026-03-15_18_02_18-.png">
        <img src="/img/content/blog/001/2026-03-15_18_02_18-.png" alt="Screenshot of an email showing Tidal had a fix for 'Live Sessions' within 7 days of complain">
    </picture>
    <figcaption>The 'We heard you' is really telling of how many users roasted them about this feature!</figcaption>
</figure>

## Problem Statement {: name='Problem'}

I wanted to check out a new Slayer album and noticed an unusual presence of EPs that clearly didn't belong to Slayer. This motivated me to look at various artists, and it appeared to me that this issue was very widespread across the entire streaming platform. 

<blockquote class="blockquote--quote">
    <p class="blockquote__text blockquote__text--quoted">
        I dont trust anyone that doesn't like Slayer.
    </p>
    <p class="blockquote__text blockquote__text--credit">
        Mike Patton
    </p>
</blockquote>

I also checked the previous artists that I had logged support requests about, and noticed that the bug had returned. The Tidal Content Team seems to be playing whack-a-mole, and doing their best efforts to manually resolve the issue per artist. However, it looks like backend routines behind the scenes just make the bug reappear.

<figure>
    <picture>
        <source type="image/webp" media="(width < 800px)" 
            srcset="/img/content/blog/001/Screenshot_2025-12-18_205008_(Small).webp">
        <source type="image/webp" media="(width >= 800px)"
            srcset="/img/content/blog/001/Screenshot_2025-12-18_205008.webp">
        <source type="image/jpeg" media="(width < 800px)"
            srcset="/img/content/blog/001/Screenshot_2025-12-18_205008_(Small).jpg">
        <source type="image/jpeg" media="(width >= 800px)"
            srcset="/img/content/blog/001/Screenshot_2025-12-18_205008.jpg">
        <img src="/img/content/blog/001/Screenshot_2025-12-18_205008.jpg" alt="Artist profile page for the Thrash Metal band, Slayer.">
    </picture>
    <figcaption>Clearly, there most recent album and two most recent EPs don't belong to Slayer.</figcaption>
</figure>

Given stellar support from Tidal in the past, I assumed there were some architectural challenges behind the lingering bug. I looked at other artists to test whether this was a one-off with Slayer, starting with Marduk. I looked at the data being received from the Tidal servers, and confirmed that multiple distinct artists sharing the same name are being returned under the same artist `id` key. The images below show two individual albums that belong to two different artists who share the name "Marduk", and also share the same `id` key.

<div class="callout--success">
    <p><strong>The Basics</strong></p>
    <p class="blockquote__text">
        In database systems, ensuring uniqueness among entries involves setting a unique identifier (ID), mostly commonly denoted <code class="code--inline">id</code>, against each record. If a user tries to query the database to create a new record with an ID that already exists in the database, then the query will fail. Imagine if two people with the same name shared the same ID in a hospital's database, and how this opens up the possibility for clinical errors.
    </p>
</div>

I saved the JSON response from when I first looked into this in June 2025. So, let's have a look and see what this would look like under the hood. I searched for an artist using the search bar and investigated the JSON response data that was sent back to my browser after clicking "Marduk" from the results.

<div class="callout--info">
    <p><strong>Datasets</strong></p>
    <p>
        The response received contains 4,096 lines of JSON, and has the following structure:
    </p>
    <ol>
        <li>
            The <code class="code--inline">header</code> (209 lines): request metadata and the artist biography that is shown in the app via <strong>More → Bio</strong>.
        </li>
        <li>
            The <code class="code--inline">item</code> (48 lines): core artist information. Notably, there is only <strong>one</strong> artist here, which already hints at merged identities.
        </li>
        <li>
            <code class="code--inline">items</code> (3,839 lines): the bulk of the data, including albums and tracks associated with this single shared `id` key.
        </li>
    </ol>
    <span class="callout__text">I've made the dataset available for download below.</span>
    <a class="icons download--inline" href="/json/blog/001/res_20250628_231412.json" target="_blank" rel="noopener noreferrer"><span class="download__text">API response</span> <img src="/img/svg/download-solid-full.svg" alt=""></a>
    <span class="callout__text">Retrieved 25th of June, 2025.</span>
</div>

To make the problem concrete, I compared a real Marduk album listed on Wikipedia (Panzer Division Marduk)[^1] and an unrelated release (*Chronos*) that does not belong to the band. Using the JSON response above, I pulled two albums out for comparison; one that is listed in the discography, and one that is not.

<div class="split-layout">

``` json
{
  "type": "ALBUM",
  "data": {
    "id": 56246454,
    "title": "Frontschwein",
    "artists": [
      {
        "id": 24059,
        "name": "Marduk"
      }
    ]
  }
}
```

```json
{
  "type": "ALBUM",
  "data": {
    "id": 432771978,
    "title": "Chronos",
    "artists": [
      {
        "id": 24059,
        "name": "Marduk"
      }
    ]
  }
}
```

</div>

The data confirms that both listings are linked to the same `id` in the backend. This raises a deeper concern than just poor UX: what prevents a bad actor from registering under a famous artist name and uploading audio to capture their streams? My best guess is that Tidal's backend automatically creates a new artist record based only on a name match. The term for this in computer programming is called a logic error[^2]. In other words, the system is doing exactly what it was programmed to do, just in the wrong way.

The diagram below illustrates how the data in the JSON request is related, visually reinforcing the flaw we confirmed earlier. There are many more keys in each table, though I've stripped it down for illustration purposes.

<figure class="figure--narrow">
    <picture>
        <source type="image/webp" 
            srcset="/img/content/blog/001/EntityRelationshipDiagram.drawio.webp">
        <source type="image/jpeg"
            srcset="/img/content/blog/001/EntityRelationshipDiagram.drawio.jpg">
        <img src="/img/content/blog/001/EntityRelationshipDiagram.drawio.png" alt="Visualisation of the database using a diagram created with draw.io.">
    </picture>
    <figcaption>Entity-relationship model deduced from JSON data.</figcaption>
</figure>

So far, we've only touched on surface-level UX problems with merged artist profiles. There's another issue under the surface which isn't immediately apparent, and that's algorithmic recommendations. Streaming services tailor your feeds based on your activity. For Tidal in particular, I haven't had the best experience with My New Arrivals and My Daily Discovery playlists due to merged artist profiles. When I first started using the platform, it was very off-putting having completely irrelevant genres of music appear out of nowhere.

<div class="callout--info">
    <p><strong>Side Note</strong></p>
    <p>
        I completely forgot about this after my initial sleuthing, only to be reminded of it later that year in December 2025. I thought, <i>'surely it's fixed by now?'</i>, and no, no it wasn't.
        I took another look at the API response which shows some changes in how the data is structured - just not the changes I wanted.
    </p>
    <p>
        Looking at this dataset, we can see that a new key named <code class="code--inline">biography</code> in the <code class="code--inline">header</code> details Marduk's biography. Objectively, this looks like a better spot for it rather than the array of `items` that contains albums and tracks.
    </p>
    <span class="callout__text">I've also made the dataset available for download below.</span>
    <a class="icons download--inline" href="/json/blog/001/res_20260118_105151.json" target="_blank" rel="noopener noreferrer"><span class="download__text">API response</span> <img src="/img/svg/download-solid-full.svg" alt=""></a>
    <span class="callout__text">Retrieved 18th of January, 2026.</span>
</div>

I obviously am operating in my own capacity, and don't have any information about Tidal's streaming architecture. That said, based on the API responses, The system appears to treat artist name as the primary identity key (or a strong match key) in some ingestion or merge pipeline, whether its a different artist with the same name.

Now that the problem has been identified and detailed, the question remains. *How would you fix it?*

## The Solution {: name='Solution'}

The root cause is simple. It is that Tidal treats canonical artist names as identity. The resolution is equally simple. Stop doing that. The implementation? That is a massive engineering undertaking at scale. Every artist must have a unique, immutable identifier. New artist entities should never be created or matched purely on display name, because names are not unique and are not stable over time. However, that only prevents the problem from getting worse. It doesn't address the existing damage where artist profiles that have already been merged, sometimes repeatedly, by backend routines that appear to revert the data back into an incorrect state. The question now becomes, *how would the currently merged artist profiles be split into separate artists?*

A small but important clue suggests that Tidal has already started moving in the right direction. Rather than logging another support request to test the theory, we can take anecdotal evidence from a forum post[^3] where a user raises the issue of an artist profile by the name "Eagles”, has been merged with another profile of the same name. The first request I logged back in March 2023 for an artist reverted back to an incorrect state, whereas now, searching for "Eagles” produces multiple separate artist results with the same name but different artist IDs. 

<figure>
    <picture>
        <source type="image/webp" media="(width < 800px)" 
            srcset="/img/content/blog/001/2026-01-23_22_02_00-TIDAL_(Small).webp">
        <source type="image/webp" media="(width >= 800px)"
            srcset="/img/content/blog/001/2026-01-23_22_02_00-TIDAL.webp">
        <source type="image/jpeg" media="(width < 800px)"
            srcset="/img/content/blog/001/2026-01-23_22_02_00-TIDAL_(Small).jpg">
        <source type="image/jpeg" media="(width >= 800px)"
            srcset="/img/content/blog/001/2026-01-23_22_02_00-TIDAL.jpg">
        <img src="/img/content/blog/001/2026-01-23_22_02_00-TIDAL.jpg" alt="Tidal search results showing separated artist profiles with the same name, &quot;Eagles&quot;">
    </picture>
    <figcaption>Tidal search result showing two separate profiles for the artist name "Eagles".</figcaption>
</figure>

That tells us the most fundamental change is already possible - name collisions can be represented as separate entities. The remaining challenge is migrating legacy merged profiles into this model. Given I've never seen a database of this scale, here's how I would go about it anyway. To keep thoughts organised, I'm going to use the Three-Layered Architecture[^4] model as an analogy to separate concerns.

1. Identity Layer
2. Remediation Layer
3. Governance Layer

### Identity Layer: Who owns What?
Establishing the identity layer is the most fundamental step. Let's think of it this way:

1. Identity (who the artist *is*)
2. Metadata (what the artist *has produced*)
3. Attribution (who claims ownership of *what*)

If identity is the entity (the artist), and metadata is the content (the releases), then attribution is the relationship between them.

Now, before I mention anything about *standards*, I'll drop one of my favourite xkcd comics[^5] down below.

<figure>
    <picture>
        <source type="image/webp"
            srcset="/img/content/blog/001/standards_2x.webp">
        <source type="image/png"
            srcset="/img/content/blog/001/standards_2x.png">
        <img src="/img/content/blog/001/standards_2x.png" alt="xkcd comic 927: &quot;Standards&quot;">
    </picture>
    <figcaption>Humorous depiction by xkcd of what generally happens after an attempt to create <i>the one <s>ring</s> ISO Unicorn to rule them all.</i></figcaption>
</figure>

When faring forth as a proprietor into a new domain, I believe it's a good idea to take a look around and understand what problems already exist, and what problems have already been solved. I did just that, and learned about DDEX[^6]. Now, I'm not saying "use standards", but we're allowed to see how existing problems have been solved and think, *that's actually a good idea*.

What I understand about DDEX, is that it doesn't want to be yet another competing standard, but guidelines on how to best leverage the chaos that already exists; be it tried and trusted methods of managing digital metadata, or why certain standards can help define authoritative external identifiers. DDEX states that the only reliable data point to uniquely identify and disambiguate artists and other parties is to use an identifier such as ISNI[^7] [^8].

This works in theory, but no one is incentivised to use an ISNI, and no one is punished for not using one either. This is why its best to use a separate internal identifier for each artist in a database to differentiate them within the platform. The external identifiers are useful for other things, which will be detailed in the **Remediation Layer** section that follows. 

Instead of waiting for the perfect standard to be invented, we can look at what guidelines exists and use our best judgement to implement or discard them. A more realistic approach could be to *support* DDEX, rather than fully *adopt* it. For example, many record labels may have a specific message and file format for transmitting metadata to streaming platforms[^9], so it might make sense to *support* these.

This is just an example how one can go about defining their identity (and governance) layer. Given that the DDEX list of registered members contains most, if not all major music streaming services, it would be very well worth looking into for existing platforms who want to define their own provenance rules.


### Remediation Layer: Fixing the Damage

The infrastructure we're working with should have isolated application environments[^10] at a bare minimum. There's plenty of documentation around on this well known practice, so I won't go into that topic any further. We'll assume this is the case, so we can create a sandbox environment to iterate on theoretical ideas, translating them to concrete solutions. The sandbox environment should be reset each day to the current state of what the production database is presenting to the outside world, e.g. 

- The Tidal desktop app. 
- The Tidal mobile app. 

Avoiding a migration strategy that leaves the remnants of the migration behind will introduce unnecessary legacy complexity. An example of such remnants would be a mapping layer for merged artist profiles so that users don't lose references to their favourite artist in playlists. I don't believe this is necessary, since this side effect seems less invasive than a merged artist profile. A simple approach for splitting merged artist profiles would be to have the most popular artist keep the existing identifier, and move the other duplicate artist(s) over to a new identifier.

The various standards that were mentioned in the **Identity Layer** section earlier are likely to be more useful to help distinguish artists contained in merged artist profiles as opposed to their canonical names. We can achieve this by developing an algorithm for calculating *confidence scores* for determining *attribution signal strength* to determine who belongs to what in a merged artist profile.

**High signal** 
We can leverage existing standards to distinguish artists. Some of these standards are as follows. 

- ISNI[^7]: Identifier to uniquely identify public identities (mentioned in the **Identity Layer** section)
- ISRC[^11]: Identifier to uniquely identify recordings. This may be a good substitute if an ISNI is not present.

**Medium signal** 
Failing *high signal* unique identifiers, we can look for other information which would provide some confidence with a margin of error. It would be best to triage these for manual review if the confidence isn't high enough. 

- ISWC[^12]: Unique identifier for musical works. I've placed this in the *medium signal* category due to the risk of duplications[^13].
- IPN[^13] [^14]
- Labels: Compare all releases with the label assigned to that release. 

**Weak signal** 
As a last resort, we can use artist names, albums, and track listings to match. Combining all of the information would give us a signal that is good enough, but should be triaged for manual review. 

- Artist listings. 
- Album listings. 
- Track listings. 

These algorithms can become quite complex over time and need some trial and error, but this initial blueprint shows the idea behind how high confidence scores can speed up the automation process.

### Governance Layer: Preventing Regressions

Artist metadata is not constant, and subject to change at any given point. If the artist already has an ISNI, then don't make a provider by giving them acronyms that they're likely going to ignore anyway. This information should be prefilled either in the system where the representative of said provider inputs information, or downloads a file format to populate and ingest into an automated system.

Place the responsibility of metadata accuracy on the provider. For example, Spotify states the following[^15].

<div class="callout--info">
    <p>
        Your music's metadata controls how your songs and releases appear on Spotify. We display your music exactly as it's delivered to us, so it's important to get your metadata right.
    </p>
    <p>
        Your metadata is set by your label or distributor before they deliver your music to us.
    </p>
    <p>
        To fix any problems with your music's metadata, your label or distributor needs to send an update to us with the right info.
    </p>
</div>

There are only so many permutations an automated system can account for, so the responsibility does have to be placed back onto the provider to input the correct information. As you can see, this can get quite complex. However, for a streaming service to continue to innovate in the space and stay the course in a highly competitive landscape, it's a non-negotiable.

This isn't a perfect blueprint, and it shouldn't be. Identity repair at this scale requires iteration, feedback, and a willingness to treat metadata not as an afterthought, but as an integral single source of truth.

## Summary {: name='References'}

This needs to be fixed before AI "artists” start creating account names for real artists, and uploading AI slop that further degrades the UX for users who rely on curated feeds for discovering the new and the old. Unsurprisingly, It looks like its already started happening, as reported on by the ABC[^16]. Artists appear to be paid by stream, which incentivises prompt monkeys to take advantage of this flaw to throw s*** at the wall until something sticks.

Music taste is entirely subjective, so I don't care if people want to generate music using LLMs and call themselves artists. I just don't want to be forced to listen to it because the curation algorithm thinks two artists with the same name are related. Tidal counts a single listen, no matter how long in duration, as a single play count. This will pollute the curation algorithm for users with slop they aren't interested in.

I don't have access to "the bank of mum and dad" to buy a farm and tinker away on some obscure Linux distro to implement my own streaming service. But I am interested in whether modern ML patterns in conjunction with whatever "AI” actually means this week, could power a recommendation layer for a self‑hosted library built entirely from purchased music.

For now, I'll go ahead and queue up [*Slayer: Kerry King's Pissed Off Playlist*](https://tidal.com/playlist/748f403b-c05f-464f-a410-95e523d66852) on Tidal and look forward to the day I have time to keep building out my homelab and a self‑hosted streaming solution for my ever‑growing CD collection.

## References {: name='References' #references__heading }

[^1]: Marduk. (n.d.). In *Wikipedia*. Retrieved January 18, 2026, from https://en.wikipedia.org/wiki/Marduk_(band)#Studio_albums

[^2]: Logic error. (n.d.). In *Wikipedia*. Retrieved March 28, 2026, from https://en.wikipedia.org/wiki/Logic_error

[^3]: WillVT. (2025, May 11). Fake AI albums on Tidal? \[Forum thread\]. AudioKarma. https://audiokarma.org/forums/threads/fake-ai-albums-on-tidal.1086004/

[^4]: Multitier architecture. (n.d.). In *Wikipedia*. Retrieved March 28, 2026, from https://en.wikipedia.org/wiki/Multitier_architecture

[^5]: Munroe, R. (2011). *Standards* \[Webcomic\]. xkcd. https://xkcd.com/927/

[^6]: DDEX. (n.d.). *Purpose*. https://ddex.net/about-ddex/purpose/

[^7]: International Standard Name Identifier. (n.d.). In *Wikipedia*. Retrieved January 31, 2026, from https://en.wikipedia.org/wiki/International_Standard_Name_Identifier

[^8]: Canonical spellings for names. (n.d.). DDEX Knowledge Base. Retrieved January 31, 2026, from https://kb.ddex.net/implementing-each-standard/best-practices-for-all-ddex-standards/guidance-on-contributors,-artists-and-writers/canonical-spellings-for-names/

[^9]: DDEX. (n.d.). In *Wikipedia*. Retrieved January 31, 2026, from https://en.wikipedia.org/wiki/DDEX

[^10]: Deployment environment. (n.d.). In *Wikipedia*. Retrieved March 28, 2026, from https://en.wikipedia.org/wiki/Deployment_environment#Environments

[^11]: International Standard Recording Code. (n.d.). In *Wikipedia*. Retrieved January 31, 2026, from https://en.wikipedia.org/wiki/International_Standard_Recording_Code

[^12]: International Standard Musical Work Code. (n.d.). In *Wikipedia*. Retrieved January 31, 2026, from https://en.wikipedia.org/wiki/International_Standard_Musical_Work_Code

[^13]: CLIP. (2025, December 9). *What is an IPN?* https://goclip.org/en/music/getting-credited-and-paid/what-is-an-ipn

[^14]: Interested Parties Information. (n.d.). In *Wikipedia*. Retrieved January 31, 2026, from https://en.wikipedia.org/wiki/Interested_Parties_Information

[^15]: Spotify. (n.d.). *Music metadata guidelines*. Spotify Support. Retrieved January 31, 2026, from https://support.spotify.com/us/artists/article/metadata-formatting-guidelines/

[^16]: Lallo, M. (2025, June 16). *'It's so dystopian': AI streaming fraud is on the rise. This Grammy nominee is fighting back*. ABC News. https://www.abc.net.au/news/2025-06-16/spotify-ai-music-streaming-fraud-sweet-enoughs-paul-bender/105408242
