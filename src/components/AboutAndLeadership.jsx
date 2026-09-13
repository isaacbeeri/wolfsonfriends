import React from "react";
import { 
  ShieldCheck, 
  FileText, 
  ExternalLink, 
  Download, 
  CheckCircle2, 
  Award, 
  Users, 
  HeartHandshake, 
  Building2, 
  Briefcase,
  Scale,  
  UserCheck 
} from "lucide-react";

export function AboutAndLeadership({ t, onOpenDonate, lang }) {
  const a = t.about;
  const isHe = lang === "he";

  // Board of directors with titles
  const boardMembersList = [
    {
      name: isHe ? "עמוס שלפמן (רו״ח)" : "Amos Shlafman, CPA",
      role: isHe ? "חבר וועד מנהל, גזבר וחבר וועדת כספים" : "Board Member, Treasurer & Finance Committee",
      tag: isHe ? "גזבר" : "Treasurer"
    },
    {
      name: isHe ? "שלמה רכט" : "Shlomo Recht",
      role: isHe ? "חבר וועד מנהל, יו״ר וועדת כספים (יו״ר בדימוס)" : "Board Member, Chair of Finance Committee (Past Board Chair)",
      tag: isHe ? "יו״ר כספים" : "Finance Chair"
    },
    {
      name: isHe ? "עו״ד מאיר הולנדר" : "Adv. Meir Hollander",
      role: isHe ? "חבר וועד מנהל ובעל זכות חתימה" : "Board Member & Signatory",
      tag: isHe ? "משפט" : "Legal"
    },
    {
      name: isHe ? "נתן שרפמן" : "Nathan Sharfman",
      role: isHe ? "חבר וועד מנהל וחבר וועדת כספים" : "Board Member & Finance Committee",
      tag: isHe ? "כספים" : "Finance"
    },
    {
      name: isHe ? "יעקב הרן" : "Yaacov Haran",
      role: isHe ? "חבר וועד מנהל" : "Board Member",
      tag: isHe ? "הנהלה" : "Board"
    },
    {
      name: isHe ? "אלי טרטנר" : "Eli Tratner",
      role: isHe ? "חבר וועד מנהל" : "Board Member",
      tag: isHe ? "הנהלה" : "Board"
    },
    {
      name: isHe ? "גיטה גופר" : "Gita Goffer",
      role: isHe ? "חברת וועד מנהל" : "Board Member",
      tag: isHe ? "הנהלה" : "Board"
    },
    {
      name: isHe ? "מוני אברהם" : "Moni Avraham",
      role: isHe ? "חבר וועד מנהל" : "Board Member",
      tag: isHe ? "הנהלה" : "Board"
    }
  ];

  return (
    <section id="about" className="py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <HeartHandshake className="w-4 h-4 text-wolfson-blue" />
            <span>{a.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
            {a.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {a.lead}
          </p>
        </div>

        {/* Story & History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-6 space-y-6 text-slate-700 leading-relaxed text-base">
            <p className="text-lg leading-relaxed text-slate-800 font-normal">
              {a.p1}
            </p>
            
            {/* Maimonides Inscribed Quote Box */}
            <div className="p-7 rounded-3xl bg-amber-50/80 border-s-4 border-amber-500 shadow-sm">
              <blockquote className="italic text-slate-900 font-serif text-xl sm:text-2xl leading-snug mb-3">
                {a.quote}
              </blockquote>
              <cite className="text-xs font-black text-amber-900 uppercase tracking-wider not-italic block">
                ✦ {a.quoteAuthor}
              </cite>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              {a.historyNote}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-slate-100 relative group">
              <img
                src="/images/nurses-history-1957.jpg"
                alt="Wolfson Nursing History"
                className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-6 sm:p-8">
                <p className="text-xs sm:text-sm text-white font-medium flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{a.historyPhotoCaption}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Governance, Transparency & Official Tax Certificates */}
        <div id="transparency" className="mb-24">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200 shadow-md">
            
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{isHe ? "שקיפות ומופת ציבורי" : "Fiduciary Integrity"}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                {a.transparencyTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {a.transparencyLead}
              </p>
            </div>

            {/* Official Documents Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Section 46 Certificate */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {isHe ? "בתוקף עד 31.12.2029" : "Valid to 31.12.2029"}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mb-2">
                    {a.docSection46Title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {a.docSection46Desc}
                  </p>
                </div>
                <a
                  href="/documents/section-46-certificate.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{a.docSection46Btn}</span>
                </a>
              </div>

              {/* Card 2: Proper Management Certificate */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                      2025–2026
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mb-2">
                    {a.docNihulTakinTitle}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {a.docNihulTakinDesc}
                  </p>
                </div>
                <a
                  href="https://www.guidestar.org.il/organization/580022507"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{a.docNihulTakinBtn}</span>
                </a>
              </div>

              {/* Card 3: Association Bylaws */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </span>
                    <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                      {isHe ? "תקנון מאושר" : "Certified Charter"}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 mb-2">
                    {a.docBylawsTitle}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {a.docBylawsDesc}
                  </p>
                </div>
                <a
                  href="https://www.guidestar.org.il/organization/580022507"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{a.docBylawsBtn}</span>
                </a>
              </div>


            </div>
          </div>
        </div>

        {/* Leadership & Governance Section (דף קשר רשמי) */}
        <div>
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5 text-wolfson-blue" />
              <span>{isHe ? "מנהיגות ציבורית" : "Leadership"}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {a.leadershipTitle}
            </h3>
            <p className="text-sm sm:text-base text-slate-600">
              {a.leadershipSub}
            </p>
          </div>

          {/* Top Row: Chairman & Executive Management */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            
            {/* Chairman Card */}
            <div className="p-7 rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col justify-between border-2 border-sky-500/30">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-extrabold uppercase tracking-wider">
                    {a.chairmanBadge}
                  </span>
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="text-2xl font-black mb-1.5 text-white tracking-tight">
                  {a.chairmanName}
                </h4>
                <p className="text-xs sm:text-sm text-sky-200 font-medium leading-relaxed">
                  {a.chairmanRole}
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-white/10 text-[11px] text-slate-300 font-medium">
                {isHe ? "בעל זכות חתימה ראשי" : "Chief Authorized Signatory"}
              </div>
            </div>

            {/* CEO / Executive Director Card */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    {isHe ? "הנהלה ראשית" : "Executive"}
                  </span>
                  <Briefcase className="w-5 h-5 text-wolfson-blue" />
                </div>
                <h4 className="text-2xl font-bold mb-1.5 text-slate-900 tracking-tight">
                  {a.ceoName}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {a.ceoRole}
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                {isHe ? "ניהול אסטרטגי ופיתוח משאבים" : "Strategic Operations & Philanthropy"}
              </div>
            </div>

            {/* Finance & Administration Card */}
            <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    {isHe ? "כספים ומינהל" : "Finance"}
                  </span>
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h4 className="text-2xl font-bold mb-1.5 text-slate-900 tracking-tight">
                  {a.bookkeeperName}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {a.bookkeeperRole}
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                {isHe ? "ניהול חשבונות וכספי העמותה" : "Financial Controller & Reporting"}
              </div>
            </div>

          </div>

          {/* Executive Board of Directors Grid */}
          <div className="mb-10">
            <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-wolfson-blue" />
              <span>{a.boardTitle}</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {boardMembersList.map((m, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between gap-3"
                >
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                      {m.name}
                    </h5>
                    <p className="text-xs text-slate-500 leading-snug mt-0.5">
                      {m.role}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 shrink-0">
                    {m.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Committee & CPA Office Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Association Auditor */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  {a.auditorTitle}
                </span>
                <h5 className="font-bold text-slate-900 text-base">
                  {a.auditorName}
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 mb-2.5">
                  {a.auditorRole}
                </p>
                <a
                  href={a.auditorLink || "https://kacpa.co.il/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <span>{isHe ? "אתר קדמי - אלחנתי" : "Kedmi - Elhanati Firm"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* CPA Accounting Firm */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">
                  {a.cpaTitle}
                </span>
                <h5 className="font-bold text-slate-900 text-base">
                  {a.cpaOfficeName}
                </h5>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isHe ? "רואי חשבון רשמיים של העמותה" : "Official CPAs of the Friends Association"}
                </p>
              </div>
            </div>

            {/* Legal Counsel - Goldfarb Gross Seligman */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 hover:border-slate-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
                  {a.legalCounselTitle}
                </span>
                <h5 className="font-bold text-slate-900 text-base">
                  {a.legalCounselName}
                </h5>
                <p className="text-xs text-slate-600 mt-0.5 mb-2.5">
                  {a.legalCounselRole}
                </p>
                <a
                  href={a.legalCounselLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:underline"
                >
                  <span>{isHe ? "אתר המשרד הרשמי" : "Official Firm Website"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Honored Past Leadership & Association Members Bar */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              ✦ {a.honoredMembersTitle}
            </span>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {a.honoredMembersDesc}
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
