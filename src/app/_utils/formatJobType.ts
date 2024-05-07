const jobTypeMap: any = {
    internship: "Internship",
    entrylevel: "Entry Level",
    associate: "Associate",
    "mid-seniorlevel": "Mid-Senior Level",
    director: "Director",
    executive: "Executive",
};

export const formatJobType = (str: string) => {
    const list = str.split(",");
    return list.map((l: any) => {
        let value = jobTypeMap[l] as any;
        return value;
    });
};
