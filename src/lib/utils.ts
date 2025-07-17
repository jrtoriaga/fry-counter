


export const calculateTotalFry = (counts: {idx: number, count:number}[]) => {
    let total = 0;

    // TODO: Fix the index logic. count.idx should be the actual index now that we're using a db
    counts.forEach((count)=>{
        const actualIndex = count.idx
        total += actualIndex * count.count
    })
    return total
}

export const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
}
