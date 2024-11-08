function calcularSubred(ip, mask, subnetMask) {
    const ipParts = ip.split('.').map(Number);
    if (
      ipParts.length !== 4 ||
      ipParts.some((part) => isNaN(part) || part < 0 || part > 255)
    ) {
      return { error: 'Dirección IP no válida' };
    }
  
    if (subnetMask < mask || subnetMask > 32) {
      return { error: 'Máscara de subred no válida' };
    }
  
    const ipInt = ipParts.reduce((acc, part) => (acc << 8) | part, 0) >>> 0;
    const networkMask = (-1 << (32 - mask)) >>> 0;
    const subnetMaskInt = (-1 << (32 - subnetMask)) >>> 0;
  
    const networkInt = ipInt & networkMask;
    const totalSubnets = 1 << (subnetMask - mask);
    const hostsPerSubnet = (1 << (32 - subnetMask)) - 2;
    const subnetIncrement = hostsPerSubnet + 2;
  
    const subnets = [];
  
    // Determinar cuántas subredes mostrar en los ejemplos
    const maxExamples = 4;
    const showAllSubnets = totalSubnets <= maxExamples;
    const firstSubnets = [];
    const lastSubnets = [];
  
    for (let i = 0; i < totalSubnets; i++) {
      const subnetNetworkInt = networkInt + i * subnetIncrement;
      const subnetBroadcastInt = subnetNetworkInt + subnetIncrement - 1;
  
      const subnetRed = intToIp(subnetNetworkInt);
      const subnetBroadcast = intToIp(subnetBroadcastInt);
      const firstHost = intToIp(subnetNetworkInt + 1);
      const lastHost = intToIp(subnetBroadcastInt - 1);
  
      const subnetData = {
        index: i + 1,
        red: subnetRed,
        broadcast: subnetBroadcast,
        rango: `${firstHost} - ${lastHost}`,
      };
  
      if (showAllSubnets) {
        subnets.push(subnetData);
      } else {
        if (i < maxExamples) {
          firstSubnets.push(subnetData);
        } else if (i >= totalSubnets - maxExamples) {
          lastSubnets.push(subnetData);
        }
      }
    }
  
    const tipo = getIpClass(ipParts[0]);
  
    return {
      tipo,
      subnetMask: subnetMask,
      subnetMaskDecimal: intToIp(subnetMaskInt),
      totalSubnets,
      hostsPerSubnet,
      subnetIncrement,
      subnets: showAllSubnets ? subnets : { firstSubnets, lastSubnets },
      showAllSubnets,
    };
  }
  
  function intToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255,
    ].join('.');
  }
  
  function getIpClass(firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126) return 'Clase A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'Clase B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'Clase C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Clase D';
    if (firstOctet >= 240 && firstOctet <= 254) return 'Clase E';
    return 'Desconocida';
  }
  
  export default calcularSubred;
  