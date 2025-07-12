


export const calculateTotalFry = (counts: {idx: number, count:number}[]) => {
    let total = 0;

    // TODO: Fix the index logic. count.idx should be the actual index now that we're using a db
    counts.forEach((count)=>{
        const actualIndex = count.idx
        total += actualIndex * count.count
    })
    return total
}