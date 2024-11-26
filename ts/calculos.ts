type SubnetData = {
  index: number;
  red: string; // Dirección de red decimal
  broadcast: string; // Dirección de broadcast decimal
  redBinario: string; // Dirección de red binario
  broadcastBinario: string; // Dirección de broadcast binario
  wildcardDecimal: string; // Wildcard de la red en decimal
  wildcardBinario: string; // Wildcard de la red en binario
  hostMin: string; // Host mínimo decimal
  hostMax: string; // Host máximo decimal
  hostMinBinario: string; // Host mínimo binario
  hostMaxBinario: string; // Host máximo binario
};

type SubnetResult = {
  tipo: string; // Clase de la IP (A, B, C, etc.)
  priv: boolean; // Indica si es una red privada
  subnetMask: number; // Máscara de subred utilizada
  subnetMaskDecimal: string; // Máscara en formato decimal
  subnetMaskBinario: string; // Máscara en formato binario
  wildcardOriginalDecimal: string; // Wildcard de la máscara original en decimal
  wildcardOriginalBinario: string; // Wildcard de la máscara original en binario
  wildcardTotalDecimal: string; // Wildcard de toda la red después del subneteo en decimal
  wildcardTotalBinario: string; // Wildcard de toda la red después del subneteo en binario
  totalSubnets: number; // Total de subredes
  hostsPerSubnet: number; // Número de hosts por subred
  subnetIncrement: number; // Incremento entre subredes
  totalHosts: number; // Total de hosts de la red completa
  network: string; // Dirección de red completa (decimal)
  networkBinario: string; // Dirección de red completa (binario)
  hostMin: string; // Host mínimo de toda la red
  hostMinBinario: string; // Host mínimo de toda la red en binario
  hostMax: string; // Host máximo de toda la red
  hostMaxBinario: string; // Host máximo de toda la red en binario
  broadcast: string; // Dirección de broadcast de toda la red
  broadcastBinario: string; // Dirección de broadcast de toda la red en binario
  inputIpBinario: string; // IP proporcionada en binario
  subnets: SubnetData[] | { firstSubnets: SubnetData[]; lastSubnets: SubnetData[] };
  showAllSubnets: boolean; // Indica si se muestran todas las subredes
  mask: number; // Máscara utilizada
  error?: string; // Mensaje de error si ocurre
  maskDecimal: string; // Máscara en formato decimal
  maskBinario: string; // Máscara en formato binario
};

function calcularSubred(
  ip: string,
  mask?: number, // Máscara opcional
  subnetMask?: number, // Submáscara opcional
  showPartialResults: boolean = false
): SubnetResult {
  const ipParts = ip.split('.').map(Number);

  // Validar la IP
  if (
      ipParts.length !== 4 ||
      ipParts.some((part) => isNaN(part) || part < 0 || part > 255)
  ) {
      return { error: 'Dirección IP no válida' } as SubnetResult;
  }

  // Convertir la IP proporcionada a binario
  const inputIpBinario = intToBinary(ipToInt(ipParts));

  // Deducir la máscara si no se proporciona
  if (mask === undefined) {
      if (ipParts[0] >= 1 && ipParts[0] <= 126) {
          mask = 8; // Clase A
      } else if (ipParts[0] >= 128 && ipParts[0] <= 191) {
          mask = 16; // Clase B
      } else if (ipParts[0] >= 192 && ipParts[0] <= 223) {
          mask = 24; // Clase C
      } else {
          return { error: 'No se puede deducir la máscara para esta dirección IP' } as SubnetResult;
      }
  }

  // Máscara de red y wildcard original
  const maskInt = (-1 << (32 - mask)) >>> 0;
  const wildcardOriginalInt = ~maskInt >>> 0;
  const maskBinario = intToBinary(maskInt);
  let wildcardOriginalBinario = intToBinary(wildcardOriginalInt);
  let wildcardOriginalDecimal = intToIp(wildcardOriginalInt);
  const maskDecimal = intToIp(maskInt);

  const networkInt = ipToInt(ipParts) & maskInt;
  const broadcastInt = networkInt + wildcardOriginalInt;
  const totalHosts = (1 << (32 - mask)) - 2; // Total de direcciones menos 2 (red y broadcast)

  const network = `${intToIp(networkInt)}/${mask}`;
  const broadcast = intToIp(broadcastInt);
  const hostMin = intToIp(networkInt + 1);
  const hostMax = intToIp(broadcastInt - 1);

  const networkBinario = intToBinary(networkInt);
  const broadcastBinario = intToBinary(broadcastInt);
  const hostMinBinario = intToBinary(networkInt + 1);
  const hostMaxBinario = intToBinary(broadcastInt - 1);

  let wildcardTotalDecimal = wildcardOriginalDecimal;
  let wildcardTotalBinario = wildcardOriginalBinario;

  // Actualización en calcularSubred para incluir la notación de bits en las wildcards
    if (subnetMask !== undefined) {
        const subnetMaskInt = (-1 << (32 - subnetMask)) >>> 0;
        const wildcardTotalInt = ~subnetMaskInt >>> 0;
        const wildcardOriginalInt = ~maskInt >>> 0;

        // Calculamos el wildcard total basado en la submáscara
        wildcardTotalDecimal = `${intToIp(wildcardTotalInt)} = ${32 - subnetMask}`;
        wildcardTotalBinario = intToBinary(wildcardTotalInt);
        
        // El wildcard original se mantiene basado en la máscara original
        wildcardOriginalDecimal = `${intToIp(wildcardOriginalInt)} = ${32 - mask}`;
        wildcardOriginalBinario = intToBinary(wildcardOriginalInt);
    } else {
        // Si no hay submáscara, el wildcard total es igual al original
        wildcardOriginalDecimal = `${intToIp(wildcardOriginalInt)} = ${32 - mask}`;
        wildcardTotalDecimal = wildcardOriginalDecimal;
        wildcardTotalBinario = intToBinary(wildcardOriginalInt);
    }

  // Cálculo de subredes
  const subnets: SubnetData[] = [];
  if (subnetMask !== undefined) {
      const subnetIncrement = (1 << (32 - subnetMask));
      const totalSubnets = 1 << (subnetMask - mask);
      const hostsPerSubnet = subnetIncrement - 2;

      // Si showPartialResults es true, solo calculamos las primeras y últimas 4 redes
      const numSubnetsToShow = showPartialResults ? 4 : totalSubnets;
      
      if (showPartialResults && totalSubnets > 8) {
        const firstSubnets: SubnetData[] = [];
        const lastSubnets: SubnetData[] = [];
    
        for (let i = 0; i < 4; i++) {
            const subnetNetworkInt = networkInt + i * subnetIncrement;
            const subnetBroadcastInt = subnetNetworkInt + subnetIncrement - 1;
    
            firstSubnets.push({
                index: i + 1,
                red: `${intToIp(subnetNetworkInt)}/${subnetMask}`,
                broadcast: intToIp(subnetBroadcastInt),
                redBinario: intToBinary(subnetNetworkInt),
                broadcastBinario: intToBinary(subnetBroadcastInt),
                wildcardDecimal: wildcardTotalDecimal,
                wildcardBinario: wildcardTotalBinario,
                hostMin: intToIp(subnetNetworkInt + 1),
                hostMax: intToIp(subnetBroadcastInt - 1),
                hostMinBinario: intToBinary(subnetNetworkInt + 1),
                hostMaxBinario: intToBinary(subnetBroadcastInt - 1),
            });
        }
    
        for (let i = totalSubnets - 4; i < totalSubnets; i++) {
            const subnetNetworkInt = networkInt + i * subnetIncrement;
            const subnetBroadcastInt = subnetNetworkInt + subnetIncrement - 1;
    
            lastSubnets.push({
                index: i + 1,
                red: `${intToIp(subnetNetworkInt)}/${subnetMask}`,
                broadcast: intToIp(subnetBroadcastInt),
                redBinario: intToBinary(subnetNetworkInt),
                broadcastBinario: intToBinary(subnetBroadcastInt),
                wildcardDecimal: wildcardTotalDecimal,
                wildcardBinario: wildcardTotalBinario,
                hostMin: intToIp(subnetNetworkInt + 1),
                hostMax: intToIp(subnetBroadcastInt - 1),
                hostMinBinario: intToBinary(subnetNetworkInt + 1),
                hostMaxBinario: intToBinary(subnetBroadcastInt - 1),
            });
        }
    
        return {
            tipo: getIpClass(ipParts[0]),
            priv: isPrivateNetwork(ipParts),
            subnetMask: subnetMask || 0,
            subnetMaskDecimal: subnetMask ? `${intToIp((-1 << (32 - subnetMask)) >>> 0)} = ${subnetMask}` : '',
            subnetMaskBinario: subnetMask ? `${intToBinary((-1 << (32 - subnetMask)) >>> 0)}` : '',
            wildcardOriginalDecimal,
            wildcardOriginalBinario,
            wildcardTotalDecimal,
            wildcardTotalBinario,
            totalSubnets,
            hostsPerSubnet,
            subnetIncrement,
            totalHosts,
            network,
            networkBinario,
            hostMin,
            hostMinBinario,
            hostMax,
            hostMaxBinario,
            broadcast,
            broadcastBinario,
            inputIpBinario,
            subnets: { firstSubnets, lastSubnets },
            showAllSubnets: false,
            mask,
            maskDecimal,
            maskBinario,
        };
    } else {
          // Mostrar todas las subredes si son pocas o no se pidió parcial
          for (let i = 0; i < totalSubnets; i++) {
              const subnetNetworkInt = networkInt + i * subnetIncrement;
              const subnetBroadcastInt = subnetNetworkInt + subnetIncrement - 1;
              
              subnets.push({
                  index: i + 1,
                  red: `${intToIp(subnetNetworkInt)}/${subnetMask}`,
                  broadcast: intToIp(subnetBroadcastInt),
                  redBinario: intToBinary(subnetNetworkInt),
                  broadcastBinario: intToBinary(subnetBroadcastInt),
                  wildcardDecimal: wildcardTotalDecimal,
                  wildcardBinario: wildcardTotalBinario,
                  hostMin: intToIp(subnetNetworkInt + 1),
                  hostMax: intToIp(subnetBroadcastInt - 1),
                  hostMinBinario: intToBinary(subnetNetworkInt + 1),
                  hostMaxBinario: intToBinary(subnetBroadcastInt - 1),
              });
          }
      }
  }

  return {
    tipo: getIpClass(ipParts[0]),
    priv: isPrivateNetwork(ipParts),
    subnetMask: subnetMask || 0,
    subnetMaskDecimal: subnetMask ? `${intToIp((-1 << (32 - subnetMask)) >>> 0)} = ${subnetMask}` : '',
    subnetMaskBinario: subnetMask ? `${intToBinary((-1 << (32 - subnetMask)) >>> 0)}` : '',
    wildcardOriginalDecimal, // Incluye la notación de bits
    wildcardOriginalBinario, // Incluye la notación de bits
    wildcardTotalDecimal,    // Incluye la notación de bits
    wildcardTotalBinario,    // Incluye la notación de bits
    totalSubnets: subnetMask ? 1 << (subnetMask - mask) : 0,
    hostsPerSubnet: subnetMask ? (1 << (32 - subnetMask)) - 2 : 0,
    subnetIncrement: subnetMask ? 1 << (32 - subnetMask) : 0,
    totalHosts,
    network,
    networkBinario,
    hostMin,
    hostMinBinario,
    hostMax,
    hostMaxBinario,
    broadcast,
    broadcastBinario,
    inputIpBinario,
    subnets: subnets,
    showAllSubnets: subnets.length > 0,
    mask,
    maskDecimal,
    maskBinario: intToBinary(maskInt),
};
}

// Funciones auxiliares
function intToBinary(int: number): string {
  return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
  ]
      .map((octet) => octet.toString(2).padStart(8, '0'))
      .join('.');
}

function intToIp(int: number): string {
  return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
  ].join('.');
}

function ipToInt(ipParts: number[]): number {
  return ipParts.reduce((acc, part) => (acc << 8) | part, 0) >>> 0;
}

function getIpClass(firstOctet: number): string {
  if (firstOctet >= 1 && firstOctet <= 126) return 'Clase A';
  if (firstOctet >= 128 && firstOctet <= 191) return 'Clase B';
  if (firstOctet >= 192 && firstOctet <= 223) return 'Clase C';
  if (firstOctet >= 224 && firstOctet <= 239) return 'Clase D';
  if (firstOctet >= 240 && firstOctet <= 254) return 'Clase E';
  return 'Desconocida';
}

function isPrivateNetwork(ipParts: number[]): boolean {
  if (ipParts[0] === 10) return true;
  if (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) return true;
  if (ipParts[0] === 192 && ipParts[1] === 168) return true;
  return false;
}

export default calcularSubred;
