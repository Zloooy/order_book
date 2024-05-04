import { PageSizeEnum } from "../types/enum/PageSizeEnum";

const mappings: { title: string; value: PageSizeEnum }[] = [
  { title: "100", value: PageSizeEnum.ONE_HUNDRED },
  { title: "500", value: PageSizeEnum.FIVE_HUNDRED },
  { title: "1000", value: PageSizeEnum.ONE_THOUSAND },
];
export default mappings;
