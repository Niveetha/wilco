export default function AboutPage() {
  return (
    <div className="page-narrow">
      <div className="section-label">ABOUT WILCO</div>
      <p style={{ lineHeight: 1.7, marginBottom: 16 }}>
        Wilco builds and decodes ICAO Doc 4444 / PANS-ATM Appendix 2 &amp; 3 air traffic
        services messages — the FPL, CHG, CNL, DLA, DEP, ARR and related message types used
        to file, amend, and track flight plans. It runs entirely in your browser (no
        server), works offline once installed, and is designed for desktop, tablet and
        mobile use.
      </p>
      <p style={{ lineHeight: 1.7, marginBottom: 16 }}>
        Every field format and message composition rule is transcribed directly from the
        Appendix 2 and Appendix 3 text of the PANS-ATM document, cited page-by-page in{' '}
        <code>docs/field-reference.md</code> and <code>docs/message-catalog.md</code> in the
        repository.
      </p>
      <p style={{ lineHeight: 1.7 }}>
        Six message types are implemented today: <strong>FPL, CHG, CNL, DLA, DEP, ARR</strong>.
        The remaining ten (ALR, RCF, CPL, EST, CDN, ACP, LAM, RQP, RQS, SPL) are on the
        roadmap — see <code>docs/roadmap.md</code> for the plan.
      </p>
    </div>
  );
}
