# Video assets

The supplied hero reel is integrated as `hero-reel.mp4` in the homepage hero.

To replace it, update the `<source src>` in the hero `<video>` element in `index.html`. Keep the video muted and inline for dependable autoplay on mobile, and update its poster image at `assets/images/brand-backdrop.jpg` if needed.

The Zwaj Centre making-of trailer is served from the public `zwaj-centre-trailer` GitHub release and embedded from `index.html`. The supplied 4K (3836 × 2160) AVC/AAC file is 123,973,831 bytes, exceeding GitHub's 100 MB per-file repository limit, so it remains an unchanged release asset rather than a Pages source file. GitHub release assets support byte-range requests for inline playback; replace the release asset and its source URL together if updating the trailer.
