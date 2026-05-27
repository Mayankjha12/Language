import { NextResponse } from "next/server";
import { allSchemes } from "@/data/allSchemes";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      age,
      income,
      occupation,
      gender,
    } = body;

    const matchedSchemes = allSchemes.filter((scheme) => {

      // Income check
      if (income > scheme.maxIncome) {
        return false;
      }

      // Age check
      if (age < scheme.minAge) {
        return false;
      }

      // Occupation check
      if (
        !scheme.occupation.includes("all") &&
        !scheme.occupation.includes(
          occupation
        )
      ) {
        return false;
      }

      // Gender check
      if (
        !scheme.gender.includes(gender)
      ) {
        return false;
      }

      return true;

    });

    return NextResponse.json({
      success: true,
      schemes: matchedSchemes,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      success: false,
      schemes: [],
    });

  }

}