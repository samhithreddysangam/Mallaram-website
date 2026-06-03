const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'app/[locale]/dashboard/admin/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

let changes = 0;

// 1. Add scanScheme state after schemeReviewLoading
const stateTarget = 'const [schemeReviewLoading, setSchemeReviewLoading] = useState<string | null>(null);';
const stateReplacement = 'const [schemeReviewLoading, setSchemeReviewLoading] = useState<string | null>(null);\n  const [scanningSchemes, setScanningSchemes] = useState(false);\n  const [scanResult, setScanResult] = useState<{newSchemes: number; errors: string[]; scanned: string[]; timestamp: string} | null>(null);';

if (content.includes(stateTarget)) {
  content = content.replace(stateTarget, stateReplacement);
  changes++;
  console.log('Added scan state variables');
}

// 2. Add scanSchemes function after handleSchemeReview
const funcTarget = '    } finally {\n      setSchemeReviewLoading(null);\n    }\n  };\n\n  const fetchVillageMetrics';
const funcReplacement = '    } finally {\n      setSchemeReviewLoading(null);\n    }\n  };\n\n  const scanGovernmentPortals = async () => {\n    setScanningSchemes(true);\n    setScanResult(null);\n    try {\n      const res = await fetch(\'/api/cron/check-schemes?admin=true\');\n      const data = await res.json();\n      setScanResult(data);\n      if (res.ok && data.newSchemes > 0) {\n        fetchSchemes();\n      }\n      if (!res.ok) {\n        alert(\'Scan failed: \' + (data.error || \'Unknown error\'));\n      }\n    } catch (error) {\n      console.error(\'Failed to scan portals:\', error);\n      alert(\'Network error during scan. Check console.\');\n    } finally {\n      setScanningSchemes(false);\n    }\n  };\n\n  const fetchVillageMetrics';

if (content.includes(funcTarget)) {
  content = content.replace(funcTarget, funcReplacement);
  changes++;
  console.log('Added scanGovernmentPortals function');
}

// 3. Add the scan button next to the Add Scheme button
const buttonTarget = '                <button \n                onClick={() => {\n                  setEditingScheme(null);\n                  setNewScheme({ title: \'\', link: \'\', description: \'\', source: \'\', category: \'\', eligibility: \'\', benefits: \'\' });\n                  setShowSchemeModal(true);\n                }}\n                className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"\n              >\n                <Plus className="w-4 h-4" />\n                Add Scheme\n              </button>';
const buttonReplacement = '              <div className="flex gap-2">\n                <button\n                  onClick={scanGovernmentPortals}\n                  disabled={scanningSchemes}\n                  className="px-6 py-3 bg-[#0A0A0A] text-[#22FF88] rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-black/10 border border-[#22FF88]/20 disabled:opacity-50"\n                >\n                  <Database className="w-4 h-4" />\n                  {scanningSchemes ? \'Scanning...\' : \'Scan Portals\'}\n                </button>\n                <button \n                  onClick={() => {\n                    setEditingScheme(null);\n                    setNewScheme({ title: \'\', link: \'\', description: \'\', source: \'\', category: \'\', eligibility: \'\', benefits: \'\' });\n                    setShowSchemeModal(true);\n                  }}\n                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"\n                >\n                  <Plus className="w-4 h-4" />\n                  Add Scheme\n                </button>\n              </div>';

if (content.includes(buttonTarget)) {
  content = content.replace(buttonTarget, buttonReplacement);
  changes++;
  console.log('Added scan button to schemes header');
} else {
  console.log('Trying alternative button match (with newline variations)...');
  // Try alternative - find Add Scheme button differently
  const altTarget = '<Plus className="w-4 h-4" />\n                Add Scheme\n              </button>';
  if (content.includes(altTarget)) {
    console.log('Found alt target');
  }
}

// 4. Add scan result banner
const bannerTarget = '            {pendingSchemes.length > 0 && (\n              <div className="mb-8 p-6 rounded-2xl bg-amber-50 border border-amber-200">';
const bannerReplacement = 
  '            {scanResult && (\n' +
  '              <div className={`mb-6 p-5 rounded-2xl ${scanResult.newSchemes > 0 ? \'bg-green-50 border border-green-200\' : \'bg-gray-50 border border-gray-200\'}`}>\n' +
  '                <div className="flex items-center justify-between">\n' +
  '                  <div className="flex items-center gap-3">\n' +
  '                    <Database className={`w-5 h-5 ${scanResult.newSchemes > 0 ? \'text-green-600\' : \'text-gray-400\'}`} />\n' +
  '                    <div>\n' +
  '                      <p className="text-sm font-black text-[#0A0A0A]">\n' +
  '                        {scanResult.newSchemes > 0\n' +
  "                          ? `Found ${scanResult.newSchemes} new scheme(s)!`\n" +
  "                          : 'No new schemes found'}\n" +
  '                      </p>\n' +
  '                      <p className="text-[10px] font-bold text-gray-500">\n' +
  "                        {`Scanned: ${scanResult.scanned.join(', ') || 'None'} | ${new Date(scanResult.timestamp).toLocaleString()}`}\n" +
  '                      </p>\n' +
  '                      {scanResult.errors.length > 0 && (\n' +
  '                        <p className="text-[9px] text-amber-600 font-medium mt-1">\n' +
  "                          {`Errors: ${scanResult.errors.join('; ')}`}\n" +
  '                        </p>\n' +
  '                      )}\n' +
  '                    </div>\n' +
  '                  </div>\n' +
  '                  <button\n' +
  '                    onClick={() => setScanResult(null)}\n' +
  '                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-all"\n' +
  '                  >\n' +
  '                    <X className="w-4 h-4" />\n' +
  '                  </button>\n' +
  '                </div>\n' +
  '              </div>\n' +
  '            )}\n\n' +
  '            {pendingSchemes.length > 0 && (\n              <div className="mb-8 p-6 rounded-2xl bg-amber-50 border border-amber-200">';

if (content.includes(bannerTarget)) {
  content = content.replace(bannerTarget, bannerReplacement);
  changes++;
  console.log('Added scan result banner');
}

// Write back
if (changes > 0) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`\nSUCCESS: ${changes} changes made.`);
} else {
  console.log('\nERROR: No changes were made.');
}
