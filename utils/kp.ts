export default function describeKp(kp: number) {

    if (kp < 0) {
        return 'Invalid Kp value';
    } else if (kp < 2) {
        return 'Quiet';
    } else if (kp < 4) {
        return 'Active';
    } else {
        return 'High';
    }
}