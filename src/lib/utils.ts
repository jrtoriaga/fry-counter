


export const calculateTotalFry = (counts: {idx: number, count:number}[]) => {
    let total = 0;

    counts.forEach((count)=>{
        const actualIndex = count.idx + 1
        total += actualIndex * count.count
    })
    return total
}