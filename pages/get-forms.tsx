
// export default async function handler(req: any, res: any) {
//     console.log("Handler")
//     try {
//         const result = { status: 200, data: { abc: 'abc' } }
//         res.status(200).json({ result })
//     } catch (err) {
//         res.status(500).json({ error: 'failed to load data' })
//     }

//     return
// }

export default function getServerSideProps(context: any) {
    let data = { abc: 'hi', def: 'bye' };

    return {
        props: {
            data
        }
    }
}


