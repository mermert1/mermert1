<script lang="ts">
  import { Button } from '$/components/ui/button';
  import { getSampleDiagrams } from '$/util/mermaid';
  import { updateCode } from '$lib/util/state';
  import { logEvent } from '$lib/util/stats';

  const extras = {
    ZenUML: `zenuml
    title Order Service
    @Actor Client #FFEBE6
    @Boundary OrderController #0747A6
    @EC2 <<BFF>> OrderService #E3FCEF
    group BusinessService {
      @Lambda PurchaseService
      @AzureFunction InvoiceService
    }

    @Starter(Client)
    // \`POST /orders\`
    OrderController.post(payload) {
      OrderService.create(payload) {
        order = new Order(payload)
        if(order != null) {
          par {
            PurchaseService.createPO(order)
            InvoiceService.createInvoice(order)      
          }      
        }
      }
    }
    `
  };

  const mainDiagrams = [
    'Simple Flowchart',
    'Advanced Flowchart (Subgraphs)',
    'Sequence: User Auth',
    'Sequence: API Flow',
    'ER: Database Schema',
    'Class: Design Pattern',
    'State: Order Lifecycle',
    'Mindmap: Project Goals',
    'Gantt: Project Roadmap',
    'Architecture: Cloud Setup'
  ];

  const templateMap: Record<string, string> = {
    'Advanced Flowchart (Subgraphs)': `flowchart TB
    subgraph "Frontend"
        A[Client] --> B[Load Balancer]
    end
    subgraph "Backend"
        B --> C[API Server]
        C --> D[(Database)]
    end`,
    'Architecture: Cloud Setup': extras.ZenUML,
    'Class: Design Pattern': `classDiagram
    class Animal {
        +String name
        +makeSound()*
    }
    class Dog {
        +makeSound()
    }
    Animal <|-- Dog`,
    'ER: Database Schema': `erDiagram
    USER ||--o{ ORDER : places
    USER {
        string username
        string email
    }
    ORDER {
        int orderNumber
        string deliveryAddress
    }`,
    'Gantt: Project Roadmap': `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`,
    'Mindmap: Project Goals': `mindmap
  root((Project))
    Performance
      Backend
      Frontend
    Features
      Offline Mode
      Sharing
    Security
      Auth
      SSL`,
    'Sequence: API Flow': `sequenceDiagram
    Client->>Proxy: Request
    Proxy->>Server: Forward
    Server-->>Proxy: Response
    Proxy-->>Client: Payload`,
    'Sequence: User Auth': `sequenceDiagram
    participant U as User
    participant A as Auth Service
    participant D as Database
    U->>A: Login(user, pass)
    A->>D: FindUser(user)
    D-->>A: UserDetails
    A-->>U: Token (JWT)`,
    'Simple Flowchart': `flowchart TD
    Start --> Stop`,
    'State: Order Lifecycle': `stateDiagram-v2
    [*] --> Pending
    Pending --> Paid
    Paid --> Shipped
    Shipped --> Delivered
    Delivered --> [*]
    Paid --> Cancelled
    Cancelled --> [*]`
  };

  const samples = { ...getSampleDiagrams() };
  const combinedSamples = { ...templateMap, ...samples };

  const loadSampleDiagram = (diagramType: string): void => {
    updateCode(combinedSamples[diagramType], {
      resetPanZoom: true,
      updateDiagram: true
    });
    logEvent('loadSampleDiagram', { diagramType });
  };

  const diagramOrder = [
    ...mainDiagrams,
    ...Object.keys(samples)
      .filter((key) => !mainDiagrams.includes(key))
      .sort()
  ];
</script>

<div class="flex flex-col gap-2 p-2">
  <div class="grid grid-cols-2 gap-2">
    {#each diagramOrder as sample (sample)}
      <Button
        variant="outline"
        size="sm"
        class="h-auto w-full justify-start py-3 text-left text-xs whitespace-normal"
        onclick={() => loadSampleDiagram(sample)}>
        {sample}
      </Button>
    {/each}
  </div>
</div>
