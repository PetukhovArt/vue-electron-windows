<script lang="ts" setup>

import {computed} from "vue";

enum UnaryCompare {
  isTrue = "isTrue",
  isFalse = "isFalse",
  not = "not",
}

enum BinaryCompare {
  andAlso = "andAlso",
  orElse = "orElse",
  equal = "equal",
  notEqual = "notEqual",
  lessThanOrEqual = "lessThanOrEqual",
  lessThan = "lessThan",
  greaterThan = "greaterThan",
  greaterThanOrEqual = "greaterThanOrEqual",
}

enum ValuesAccess {
  memberAccess = "memberAccess",
  call = "call",
  constant = "constant"
}

const tree = {
  $type: BinaryCompare.orElse,
  left: {
    $type: BinaryCompare.andAlso,
    left: {
      $type: BinaryCompare.greaterThan,
      left: {
        $type: ValuesAccess.memberAccess, // указываем что значение это memberAccess
        name: "LineId",
      },
      right: {
        $type: ValuesAccess.constant, // указываем что значение это константа
        value: "fdsfsdfsdfsdfsdf123",
      },
    },
    right: {
      $type: BinaryCompare.lessThan,
      left: {
        $type: ValuesAccess.memberAccess,
        name: "LineId",
      },
      right: {
        $type: ValuesAccess.constant,
        value: "4324324324324fdfd",
      },
    },
  },
  right: {
    $type: BinaryCompare.andAlso,
    left: {
      $type: BinaryCompare.greaterThan,
      left: {
        $type: ValuesAccess.memberAccess,
        name: "time",
      },
      right: {
        $type: ValuesAccess.constant, // constant
        value: "16:00",
      },
    },
    right: {
      $type: BinaryCompare.lessThan,
      left: {
        $type: ValuesAccess.memberAccess,
        name: "time",
      },
      right: {
        $type: ValuesAccess.constant,
        value: "21:00",
      },
    },
  },
};

const operatorTypes = Object.values(BinaryCompare)
const leafTypes = Object.values(ValuesAccess)

let idCounter = 1;
let normalizedTree: { [key: string]: any } = {};

function parseNode(node: any, parentId: string | null = null): string {
  const id = idCounter.toString();
  normalizedTree[id] = {
    id: id,
    $type: node.$type,
    parent: parentId,
  };
  idCounter++;

  if (operatorTypes.includes(node.$type)) {
    normalizedTree[id].left = parseNode(node.left, id);
    normalizedTree[id].right = parseNode(node.right, id);
  } else if (leafTypes.includes(node.$type)) {
    if (node.$type === ValuesAccess.memberAccess) {
      normalizedTree[id].name = node.name;
    } else if (node.$type === ValuesAccess.constant) {
      normalizedTree[id].value = node.value;
    }
  }

  return id;
}

const precedence: { [key: string]: number } = {
  [BinaryCompare.orElse]: 1,
  [BinaryCompare.andAlso]: 2,
  [BinaryCompare.equal]: 3,
  [BinaryCompare.notEqual]: 3,
  [BinaryCompare.lessThanOrEqual]: 3,
  [BinaryCompare.lessThan]: 3,
  [BinaryCompare.greaterThan]: 3,
  [BinaryCompare.greaterThanOrEqual]: 3,
};

let groupCounter = 1;

function generateGroupId(): string {
  return `group-${groupCounter++}`;
}

function flatTree(nodeId: string, parentPrecedence: number = 0): any[] {
  const node = normalizedTree[nodeId];
  if (operatorTypes.includes(node.$type)) {
    const currentPrecedence = precedence[node.$type];
    let leftNodes = flatTree(node.left, currentPrecedence);
    let rightNodes = flatTree(node.right, currentPrecedence);

    if (currentPrecedence > parentPrecedence) {
      const groupId = generateGroupId();
      return [
        {type: 'group-start', id: groupId},
        ...leftNodes,
        {type: 'operation-select', value: node.$type, id: node.id},
        ...rightNodes,
        {type: 'group-end', id: groupId},
      ];
    } else {
      return [
        ...leftNodes,
        {type: 'operation-select', value: node.$type, id: node.id},
        ...rightNodes,
      ];
    }
  } else if (leafTypes.includes(node.$type)) {
    let uiType: string;
    if (node.$type === ValuesAccess.memberAccess) {
      uiType = 'member-input';
    } else if (node.$type === ValuesAccess.constant) {
      uiType = 'value-input';
    } else if (node.$type === ValuesAccess.call) {
      uiType = 'function-input';
    }
    return [
      {
        type: uiType,
        value: node.value || node.name,
        id: node.id,
      },
    ];
  }
  return [];
}

const flatStructure = computed(() => {
  parseNode(tree)
  return flatTree(Object.keys(normalizedTree)[0])
})

console.log(flatStructure.value);

</script>

<template>
  <div ref="container" @dragover="allowDrop" @drop="handleDrop">
    <div v-for="item in flatStructure" v-if="item.type !== 'group-end'" :key="item.id">
      <template v-if="item.type === 'group-start'">
        <div :id="item.id" class="group-container" @dragenter="handleDragEnter(item.id)">
          <div v-for="child in getGroupChildren(item.id)" :key="child.id">
            <!-- Render child elements recursively -->
            <render-element :element="child"/>
          </div>
        </div>
      </template>
      <template v-else-if="item.type === 'operation-select'">
        <div class="operation-selector" draggable="true" @dragstart="handleDragStart($event, item)">
          {{ item.value }}
        </div>
      </template>
      <template v-else-if="item.type === 'member-input' || item.type === 'value-input'">
        <div class="input-element" draggable="true" @dragstart="handleDragStart($event, item)">
          {{ item.value }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>