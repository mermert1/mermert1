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

  const samples = { ...getSampleDiagrams(), ...extras } as const;
  const loadSampleDiagram = (diagramType: string): void => {
    updateCode(samples[diagramType], {
      resetPanZoom: true,
      updateDiagram: true
    });
    logEvent('loadSampleDiagram', { diagramType });
  };

  const mainDiagrams = [
    'Flowchart',
    'Class',
    'Sequence',
    'Entity Relationship',
    'State',
    'Mindmap'
  ];

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
        class="h-auto w-full justify-start py-2 text-left text-xs whitespace-normal"
        onclick={() => loadSampleDiagram(sample)}>
        {sample}
      </Button>
    {/each}
  </div>
</div>
