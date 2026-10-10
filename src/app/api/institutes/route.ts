import { NextRequest, NextResponse } from "next/server";
import { getDatabaseUrl } from "@/lib/db";

// Comprehensive fallback dataset of Examination Boards across Pakistan
export const BOARDS_DATASET = [
  "Federal Board of Intermediate and Secondary Education (FBISE), Islamabad",
  "Board of Intermediate & Secondary Education (BISE) Lahore",
  "Board of Intermediate & Secondary Education (BISE) Rawalpindi",
  "Board of Intermediate & Secondary Education (BISE) Faisalabad",
  "Board of Intermediate & Secondary Education (BISE) Gujranwala",
  "Board of Intermediate & Secondary Education (BISE) Multan",
  "Board of Intermediate & Secondary Education (BISE) Bahawalpur",
  "Board of Intermediate & Secondary Education (BISE) Sahiwal",
  "Board of Intermediate & Secondary Education (BISE) Sargodha",
  "Board of Intermediate & Secondary Education (BISE) Dera Ghazi Khan",
  "Board of Intermediate Education Karachi (BIEK)",
  "Board of Secondary Education Karachi (BSEK)",
  "Board of Intermediate & Secondary Education (BISE) Hyderabad",
  "Board of Intermediate & Secondary Education (BISE) Sukkur",
  "Board of Intermediate & Secondary Education (BISE) Larkana",
  "Board of Intermediate & Secondary Education (BISE) Mirpurkhas",
  "Board of Intermediate & Secondary Education (BISE) Shaheed Benazirabad",
  "Board of Intermediate & Secondary Education (BISE) Peshawar",
  "Board of Intermediate & Secondary Education (BISE) Mardan",
  "Board of Intermediate & Secondary Education (BISE) Abbottabad",
  "Board of Intermediate & Secondary Education (BISE) Swat",
  "Board of Intermediate & Secondary Education (BISE) Malakand",
  "Board of Intermediate & Secondary Education (BISE) Kohat",
  "Board of Intermediate & Secondary Education (BISE) Bannu",
  "Board of Intermediate & Secondary Education (BISE) D.I. Khan",
  "Board of Intermediate & Secondary Education (BISE) Quetta",
  "Board of Intermediate & Secondary Education (BISE) Turbat",
  "Board of Intermediate & Secondary Education (BISE) Loralai",
  "Board of Intermediate & Secondary Education (BISE) Mirpur (AJK)",
  "Punjab Board of Technical Education (PBTE), Lahore",
  "Sindh Board of Technical Education (SBTE), Karachi",
  "KPK Board of Technical Education (KPBTE), Peshawar",
  "University Degree / Affiliated Institution Examination Division",
  "Other / Autonomous Examination Authority",
];

// Comprehensive fallback dataset of Institutes, Colleges & Universities
export const INSTITUTES_DATASET = [
  "University of the Punjab (PU), Lahore",
  "Government College University (GCU), Lahore",
  "University of Engineering and Technology (UET), Lahore",
  "Lahore University of Management Sciences (LUMS), Lahore",
  "National University of Sciences and Technology (NUST), Islamabad",
  "Quaid-i-Azam University (QAU), Islamabad",
  "COMSATS University Islamabad (CUI)",
  "FAST - National University of Computer and Emerging Sciences, Islamabad/Lahore",
  "University of Agriculture (UAF), Faisalabad",
  "Bahauddin Zakariya University (BZU), Multan",
  "Islamia University of Bahawalpur (IUB)",
  "University of Sargodha (UOS)",
  "University of Gujrat (UOG)",
  "Fatima Jinnah Women University (FJWU), Rawalpindi",
  "Lahore College for Women University (LCWU), Lahore",
  "University of Karachi (UoK), Karachi",
  "NED University of Engineering and Technology, Karachi",
  "Dow University of Health Sciences, Karachi",
  "King Edward Medical University (KEMU), Lahore",
  "Allama Iqbal Medical College, Lahore",
  "Rawalpindi Medical University, Rawalpindi",
  "Nishtar Medical University, Multan",
  "University of Peshawar, Peshawar",
  "University of Engineering and Technology (UET), Peshawar",
  "Ghulam Ishaq Khan Institute (GIKI), Topi",
  "Institute of Business Administration (IBA), Karachi",
  "Allama Iqbal Open University (AIOU), Islamabad",
  "Virtual University of Pakistan (VU), Lahore",
  "National University of Modern Languages (NUML), Islamabad",
  "Bahria University, Islamabad/Karachi",
  "Air University, Islamabad",
  "Kinnaird College for Women, Lahore",
  "Forman Christian College (FCCU), Lahore",
  "Punjab Group of Colleges (PGC)",
  "KIPS College",
  "Aspire College",
  "Superior College",
  "Concordia Colleges",
  "Govt. MAO College, Lahore",
  "Govt. Islamia College Civil Lines, Lahore",
  "Govt. Post Graduate College, Rawalpindi",
  "Govt. Post Graduate College, Faisalabad",
  "Govt. Post Graduate College, Multan",
  "Govt. Post Graduate College, Sialkot",
  "Govt. Post Graduate College, Gujranwala",
  "Govt. Degree College for Boys, Satellite Town Rawalpindi",
  "Govt. Degree College for Women, Satellite Town Rawalpindi",
  "Govt. Gordon College, Rawalpindi",
  "Govt. Emerson University / College, Multan",
  "Govt. College of Science, Wahdat Road Lahore",
  "Govt. Islamia College Railway Road, Lahore",
  "Govt. College of Commerce, Lahore",
  "Govt. High School (Boys), Lahore",
  "Govt. High School (Girls), Lahore",
  "Govt. Higher Secondary School (Boys), Rawalpindi",
  "Govt. Higher Secondary School (Girls), Faisalabad",
  "Govt. Pilot High School, Lahore",
  "Govt. Comprehensive High School, Multan",
  "Army Public School & College System (APSACS)",
  "Beaconhouse School System / College",
  "The City School / Alpha College",
  "Cadet College Hasan Abdal",
  "Cadet College Kohat",
  "Cadet College Petaro",
  "Cadet College Mastung",
  "Mehran University of Engineering and Technology, Jamshoro",
  "University of Sindh, Jamshoro",
  "University of Balochistan, Quetta",
  "BUITEMS, Quetta",
  "Mirpur University of Science and Technology (MUST), AJK",
  "University of Azad Jammu and Kashmir (UAJK), Muzaffarabad",
  "Karakoram International University (KIU), Gilgit",
  "Other / Unlisted Institute or College",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("query") || "").trim().toLowerCase();
    const type = searchParams.get("type"); // "board" or "institute"

    // Query institute_datasets in Neon Postgres
    try {
      const postgres = (await import("postgres")).default;
      const dbUrl = getDatabaseUrl();
      const sql = postgres(dbUrl, { ssl: "require", max: 1 });

      let rows: any[] = [];
      if (type === "board") {
        if (query) {
          rows = await sql`
            SELECT name FROM institute_datasets 
            WHERE type = 'Board' AND name ILIKE ${'%' + query + '%'} 
            LIMIT 40
          `;
        } else {
          rows = await sql`
            SELECT name FROM institute_datasets 
            WHERE type = 'Board' 
            LIMIT 40
          `;
        }
      } else {
        if (query) {
          rows = await sql`
            SELECT name FROM institute_datasets 
            WHERE type != 'Board' AND name ILIKE ${'%' + query + '%'} 
            LIMIT 40
          `;
        } else {
          rows = await sql`
            SELECT name FROM institute_datasets 
            WHERE type != 'Board' 
            LIMIT 40
          `;
        }
      }

      await sql.end({ timeout: 2 });

      if (rows && rows.length > 0) {
        return NextResponse.json({
          source: "neon-postgres",
          results: rows.map((r: any) => r.name),
        });
      }
    } catch (dbError) {
      console.warn("Neon Postgres query fallback to in-memory dataset:", dbError);
    }

    // Fallback to comprehensive built-in dataset
    const dataset = type === "board" ? BOARDS_DATASET : INSTITUTES_DATASET;
    const filtered = query
      ? dataset.filter((item) => item.toLowerCase().includes(query))
      : dataset;

    return NextResponse.json({
      source: "local-dataset",
      results: filtered.slice(0, 40),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch institute dataset", details: error?.message },
      { status: 500 }
    );
  }
}
