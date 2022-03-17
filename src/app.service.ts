import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import * as fs from 'fs';
import uuid from 'uuid';

const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: 'TM_IikW1Sho+3=2H9Lmq',
  },
  tls: {
    ca: fs.readFileSync('./http_ca.crt'),
    rejectUnauthorized: false,
  },
});
// const client = new OpenSearchClient({});
// const command = new AcceptInboundConnectionCommand({
//   ConnectionId: 'test-performance',
// });

const indexName = 'users3';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async applyPipeline() {
    // return await client.ingest.getPipeline();
    return await client.ingest.putPipeline({
      id: 'get-last-name',
      description: 'Get last name',
      processors: [
        {
          split: {
            field: 'name',
            target_field: 'last_name',
            separator: '',
          },
        },
      ],
    });
  }

  async findData() {
    // const data = await client.sql.query({
    //   query: `SELECT * FROM "game-of-thrones"`,

    // });

    const data = await client.search({
      index: indexName,
      aggs: {
        sellerComission: {
          terms: { field: 'id', size: 5000 },
          aggs: {
            totalSell: {
              // sum: { field: 'price',  },
              sum: {
                script: {
                  source:
                    "if (doc['id'].value > params['limit']) { return params['ifValue'] } else { return params['elseValue'] }",
                  params: {
                    limit: 50,
                    ifValue: 1,
                    elseValue: 0,
                  },
                },
              },
            },
          },
        },
        // hat_prices: { sum: { field: 'price' } },
      },
      track_total_hits: true,
      size: 0,
    });
    return data;
    // const data = hits client.send(command);

    // console.log(data);

    return 'Finish';
  }
  async indexData() {
    let data = [];
    for (let i = 0; i <= 70000; i++) {
      data.push({ index: { _index: indexName } });
      data.push({
        // _id: id,
        id: Math.floor(Math.random() * (100 - 1) + 1),
        index: 0,
        guid: 'd7264d3a-c644-444a-ada4-3998437e4ea6',
        isActive: false,
        balance: '$1,101.82',
        age: 34,
        eyeColor: 'blue',
        name: 'Lolita Roman',
        gender: 'female',
        company: 'METROZ',
        email: 'lolitaroman@metroz.com',
        phone: '+1 (845) 586-3265',
        address: '680 Meadow Street, Carbonville, Missouri, 7289',
        about:
          'Sit quis eu dolore excepteur nisi excepteur. Occaecat ut occaecat cillum ut amet sint tempor nostrud minim. Occaecat anim consequat et fugiat reprehenderit minim et ipsum aute ullamco ad adipisicing aliquip. Nisi anim Lorem dolore proident consectetur duis. Consequat nostrud labore duis consequat consequat laboris proident ex. Minim fugiat tempor quis ex ex magna veniam nulla duis quis non.\r\n',
        registered: '2020-07-15T12:10:29 +03:00',
        latitude: 76.827748,
        longitude: 28.141638,
        tags: [
          'fugiat',
          'nostrud',
          'dolor',
          'ad',
          'pariatur',
          'nisi',
          'veniam',
        ],
        friends: [
          {
            id: 0,
            name: 'Marietta Mejia',
          },
          {
            id: 1,
            name: 'Alexander Moran',
          },
          {
            id: 2,
            name: 'Tonia Merrill',
          },
        ],
        price: Math.floor(Math.random() * (100000 - 1)) + 1,
        price2: Math.floor(Math.random() * (100000 - 1)) + 1,
        greeting: 'Hello, Lolita Roman! You have 2 unread messages.',
        favoriteFruit: 'banana',
      });
    }
    await client.bulk({
      // index: indexName,
      // pipeline: 'get-last-name',
      operations: data,
    });

    return 'Stored!';
  }

  async clearData() {
    return await client.deleteByQuery({
      index: indexName,
      query: {},
    });
  }
}
